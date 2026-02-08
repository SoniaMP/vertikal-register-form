import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";
import { registrationSchema } from "@/validations/registration";
import { calculateTotal } from "@/helpers/price-calculator";
import type { FederationType } from "@/types";

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

  // Fetch federation type with supplements from DB
  const federationType = (await prisma.federationType.findUnique({
    where: { id: data.federationTypeId, active: true },
    include: { supplements: { where: { active: true } } },
  })) as FederationType | null;

  if (!federationType) {
    return NextResponse.json(
      { error: "Tipo de federativa no encontrado" },
      { status: 400 },
    );
  }

  // Validate selected supplements belong to this federation type
  const validSupplements = federationType.supplements.filter((s) =>
    data.supplementIds.includes(s.id),
  );

  if (validSupplements.length !== data.supplementIds.length) {
    return NextResponse.json(
      { error: "Suplementos inválidos para esta federativa" },
      { status: 400 },
    );
  }

  // Server-side price calculation (never trust the frontend)
  const breakdown = calculateTotal(federationType, validSupplements);

  // Create registration in DB
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

  // Build Stripe line items
  const lineItems = [
    {
      price_data: {
        currency: "eur",
        product_data: { name: federationType.name },
        unit_amount: federationType.price,
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

    // Store Stripe session ID
    await prisma.registration.update({
      where: { id: registration.id },
      data: { stripeSessionId: session.id },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    // Mark registration as failed so it doesn't stay PENDING forever
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
