import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";
import { registrationSchema } from "@/validations/registration";
import { calculateTotal } from "@/helpers/price-calculator";
import type { FederationType, FederationSubtype } from "@/types";

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

  const federationType = (await prisma.federationType.findUnique({
    where: { id: data.federationTypeId, active: true },
    include: {
      subtypes: { where: { active: true } },
      supplements: { where: { active: true } },
    },
  })) as FederationType | null;

  if (!federationType) {
    return NextResponse.json(
      { error: "Tipo de federativa no encontrado" },
      { status: 400 },
    );
  }

  const subtype = federationType.subtypes.find(
    (s) => s.id === data.federationSubtypeId,
  ) as FederationSubtype | undefined;

  if (!subtype) {
    return NextResponse.json(
      { error: "Subtipo de federativa no encontrado o no pertenece al tipo seleccionado" },
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

  const breakdown = calculateTotal(subtype, validSupplements);

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
      totalAmount: breakdown.total,
      paymentStatus: "PENDING",
      supplements: {
        create: validSupplements.map((s) => ({
          supplementId: s.id,
          priceAtTime: s.price,
        })),
      },
    },
  });

  const lineItems = [
    {
      price_data: {
        currency: "eur",
        product_data: { name: `${federationType.name} - ${subtype.name}` },
        unit_amount: subtype.price,
      },
      quantity: 1,
    },
    ...validSupplements.map((s) => ({
      price_data: {
        currency: "eur",
        product_data: { name: s.name },
        unit_amount: s.price,
      },
      quantity: 1,
    })),
  ];

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

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
