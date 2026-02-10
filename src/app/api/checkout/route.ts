import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";
import { registrationSchema } from "@/validations/registration";
import { calculateTotal } from "@/helpers/price-calculator";
import { getMembershipFee } from "@/lib/settings";
import type { Supplement } from "@/types";

export async function POST(request: NextRequest) {
  const stripe = getStripe();
  const body = await request.json();
  const parsed = registrationSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos de registro inválidos", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const data = parsed.data;

  const federationType = await prisma.federationType.findUnique({
    where: { id: data.federationTypeId, active: true },
    include: {
      subtypes: { where: { active: true } },
      categories: {
        where: { active: true },
        include: { prices: true },
      },
      supplements: {
        where: { active: true },
        include: { supplementGroup: true },
      },
      supplementGroups: true,
    },
  });

  if (!federationType) {
    return NextResponse.json(
      { error: "Tipo de federativa no encontrado" },
      { status: 400 },
    );
  }

  const subtype = federationType.subtypes.find(
    (s) => s.id === data.federationSubtypeId,
  );

  if (!subtype) {
    return NextResponse.json(
      { error: "Subtipo de federativa no encontrado" },
      { status: 400 },
    );
  }

  const category = federationType.categories.find(
    (c) => c.id === data.categoryId,
  );

  if (!category) {
    return NextResponse.json(
      { error: "Categoría no encontrada" },
      { status: 400 },
    );
  }

  const categoryPrice = category.prices.find(
    (p) => p.subtypeId === subtype.id,
  );

  if (!categoryPrice) {
    return NextResponse.json(
      { error: "No hay precio definido para esta combinación de categoría y subtipo" },
      { status: 400 },
    );
  }

  const validSupplements = federationType.supplements.filter((s) =>
    data.supplementIds.includes(s.id),
  );

  if (validSupplements.length !== data.supplementIds.length) {
    return NextResponse.json(
      { error: "Suplementos inválidos para esta federativa" },
      { status: 400 },
    );
  }

  const supplementsTyped: Supplement[] = validSupplements.map((s) => ({
    id: s.id,
    name: s.name,
    description: s.description,
    price: s.price,
    active: s.active,
    federationTypeId: s.federationTypeId,
    supplementGroupId: s.supplementGroupId,
    supplementGroup: s.supplementGroup
      ? {
          id: s.supplementGroup.id,
          name: s.supplementGroup.name,
          price: s.supplementGroup.price,
          federationTypeId: s.supplementGroup.federationTypeId,
        }
      : null,
  }));

  const membershipFee = await getMembershipFee();

  const breakdown = calculateTotal(
    category.name,
    categoryPrice.price,
    supplementsTyped,
    membershipFee,
  );

  const registration = await prisma.registration.create({
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      dni: data.dni,
      dateOfBirth: data.dateOfBirth,
      address: data.address,
      city: data.city,
      postalCode: data.postalCode,
      province: data.province,
      federationTypeId: data.federationTypeId,
      federationSubtypeId: data.federationSubtypeId,
      categoryId: data.categoryId,
      totalAmount: breakdown.total,
      paymentStatus: "PENDING",
      supplements: {
        create: validSupplements.map((s) => ({
          supplementId: s.id,
          priceAtTime: s.price ?? 0,
        })),
      },
    },
  });

  const lineItems = [
    {
      price_data: {
        currency: "eur",
        product_data: {
          name: `${federationType.name} - ${subtype.name} - ${category.name}`,
        },
        unit_amount: categoryPrice.price,
      },
      quantity: 1,
    },
    {
      price_data: {
        currency: "eur",
        product_data: { name: "Cuota de socio" },
        unit_amount: membershipFee,
      },
      quantity: 1,
    },
    ...breakdown.supplements.map((s) => ({
      price_data: {
        currency: "eur",
        product_data: { name: s.name },
        unit_amount: s.price,
      },
      quantity: 1,
    })),
  ];

  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ?? new URL(request.url).origin;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: lineItems,
      customer_email: data.email,
      metadata: { registrationId: registration.id },
      success_url: `${appUrl}/registro/exito?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/registro/cancelado?registration_id=${registration.id}`,
    });

    await prisma.registration.update({
      where: { id: registration.id },
      data: { stripeSessionId: session.id },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    await prisma.registration.update({
      where: { id: registration.id },
      data: { paymentStatus: "FAILED" },
    });

    const message =
      err instanceof Error ? err.message : "Error al crear sesión de pago";
    console.error("Stripe checkout error:", message);

    return NextResponse.json(
      { error: `Error al conectar con la pasarela de pago: ${message}` },
      { status: 502 },
    );
  }
}
