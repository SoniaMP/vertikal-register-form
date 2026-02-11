import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";
import { registrationSchema } from "@/validations/registration";
import { getMembershipFee, getActiveSeason } from "@/lib/settings";
import { normalizeDni } from "@/helpers/migration-helpers";

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
  const season = await getActiveSeason();

  const offering = await prisma.licenseOffering.findFirst({
    where: {
      seasonId: season.id,
      typeId: data.typeId,
      subtypeId: data.subtypeId,
      categoryId: data.categoryId,
    },
    include: {
      type: true,
      subtype: true,
      category: true,
    },
  });

  if (!offering) {
    return NextResponse.json(
      { error: "No hay oferta para esta combinación de licencia y categoría" },
      { status: 400 },
    );
  }

  const selectedSupplements = await prisma.supplement.findMany({
    where: {
      id: { in: data.supplementIds },
      active: true,
    },
    include: { supplementGroup: true },
  });

  if (selectedSupplements.length !== data.supplementIds.length) {
    return NextResponse.json(
      { error: "Suplementos inválidos" },
      { status: 400 },
    );
  }

  const supplementPrices = await prisma.supplementPrice.findMany({
    where: {
      seasonId: season.id,
      supplementId: { in: data.supplementIds },
    },
  });
  const priceBySupplementId = new Map(
    supplementPrices.map((sp) => [sp.supplementId, sp.price]),
  );

  const groupIds = [
    ...new Set(
      selectedSupplements
        .map((s) => s.supplementGroupId)
        .filter((id): id is string => id !== null),
    ),
  ];

  const groupPrices = await prisma.supplementGroupPrice.findMany({
    where: { seasonId: season.id, groupId: { in: groupIds } },
  });
  const priceByGroupId = new Map(
    groupPrices.map((gp) => [gp.groupId, gp.price]),
  );

  const membershipFee = await getMembershipFee();

  let supplementsTotal = 0;
  const supplementLineItems: { name: string; price: number }[] = [];
  const seenGroupIds = new Set<string>();

  for (const s of selectedSupplements) {
    if (s.supplementGroupId && priceByGroupId.has(s.supplementGroupId)) {
      if (!seenGroupIds.has(s.supplementGroupId)) {
        seenGroupIds.add(s.supplementGroupId);
        const groupPrice = priceByGroupId.get(s.supplementGroupId)!;
        const groupName = s.supplementGroup?.name ?? "Grupo";
        supplementLineItems.push({ name: groupName, price: groupPrice });
        supplementsTotal += groupPrice;
      }
    } else {
      const price = priceBySupplementId.get(s.id) ?? 0;
      supplementLineItems.push({ name: s.name, price });
      supplementsTotal += price;
    }
  }

  const total = offering.price + membershipFee + supplementsTotal;
  const licenseLabel = `${offering.type.name} - ${offering.subtype.name} - ${offering.category.name}`;

  const normalizedDni = normalizeDni(data.dni);

  const member = await prisma.member.upsert({
    where: { dni: normalizedDni },
    update: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      dateOfBirth: data.dateOfBirth,
      address: data.address,
      city: data.city,
      postalCode: data.postalCode,
      province: data.province,
    },
    create: {
      dni: normalizedDni,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      dateOfBirth: data.dateOfBirth,
      address: data.address,
      city: data.city,
      postalCode: data.postalCode,
      province: data.province,
    },
  });

  const membership = await prisma.membership.create({
    data: {
      memberId: member.id,
      seasonId: season.id,
      typeId: data.typeId,
      subtypeId: data.subtypeId,
      categoryId: data.categoryId,
      offeringId: offering.id,
      licensePriceSnapshot: offering.price,
      licenseLabelSnapshot: licenseLabel,
      totalAmount: total,
      paymentStatus: "PENDING",
      consentedAt: new Date(),
      supplements: {
        create: selectedSupplements.map((s) => ({
          supplementId: s.id,
          priceAtTime: priceBySupplementId.get(s.id) ?? 0,
        })),
      },
    },
  });

  const lineItems = [
    {
      price_data: {
        currency: "eur",
        product_data: { name: licenseLabel },
        unit_amount: offering.price,
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
    ...supplementLineItems.map((s) => ({
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
      metadata: { membershipId: membership.id },
      success_url: `${appUrl}/registro/exito?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/registro/cancelado?membership_id=${membership.id}`,
    });

    await prisma.membership.update({
      where: { id: membership.id },
      data: { stripeSessionId: session.id },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    await prisma.membership.update({
      where: { id: membership.id },
      data: { paymentStatus: "FAILED", status: "CANCELLED" },
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
