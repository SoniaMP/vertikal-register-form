export const dynamic = "force-dynamic";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getMembershipFee } from "@/lib/settings";
import { fetchLicenseCatalog } from "@/lib/license-catalog";
import { RegistrationWizard } from "@/components/registration/registration-wizard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = {
  title: "Alta nueva - Club Vertikal",
  description: "Regístrate como nuevo socio del Club Vertikal",
};

export default async function AltaPage() {
  const [licenseTypes, membershipFee] = await Promise.all([
    fetchLicenseCatalog(),
    getMembershipFee(),
  ]);

  return (
    <>
      <Button variant="ghost" asChild className="mb-4">
        <Link href="/registro">
          <ArrowLeft className="mr-2 size-4" />
          Volver atrás
        </Link>
      </Button>
      <Card>
        <CardContent>
          <RegistrationWizard
            licenseTypes={licenseTypes}
            membershipFee={membershipFee}
          />
        </CardContent>
      </Card>
    </>
  );
}
