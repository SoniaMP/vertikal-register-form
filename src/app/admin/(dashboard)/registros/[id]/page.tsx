import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { RegistrationDetail } from "@/components/admin/registration-detail";

type Props = { params: Promise<{ id: string }> };

export default async function RegistrationDetailPage({ params }: Props) {
  const { id } = await params;

  const registration = await prisma.registration.findUnique({
    where: { id },
    include: {
      federationType: true,
      federationSubtype: true,
      supplements: { include: { supplement: true } },
    },
  });

  if (!registration) notFound();

  const categoryPrice = await prisma.categoryPrice.findUnique({
    where: {
      categoryId_subtypeId: {
        categoryId: registration.categoryId,
        subtypeId: registration.federationSubtypeId,
      },
    },
  });

  const registrationData = {
    ...registration,
    subtypePrice: categoryPrice?.price ?? 0,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Volver
          </Link>
        </Button>
        <h1 className="text-xl font-bold sm:text-2xl">
          {registration.firstName} {registration.lastName}
        </h1>
      </div>
      <RegistrationDetail registration={registrationData} />
    </div>
  );
}
