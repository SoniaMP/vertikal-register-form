"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RenewalLookup } from "./renewal-lookup";
import { RegistrationWizard } from "./registration-wizard";
import type { RenewalSearchResult } from "@/app/registro/actions";
import type { FederationType } from "@/types";
import { RegistrationInput } from "@/validations/registration";

type RenewalFlowProps = {
  federationTypes: FederationType[];
  membershipFee: number;
};

export function RenewalFlow({
  federationTypes,
  membershipFee,
}: RenewalFlowProps) {
  const [renewalData, setRenewalData] = useState<RenewalSearchResult | null>(
    null,
  );

  if (!renewalData) {
    return <RenewalLookup onFound={setRenewalData} />;
  }

  const defaultValues: Partial<RegistrationInput> = renewalData;

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
            federationTypes={federationTypes}
            membershipFee={membershipFee}
            mode="renewal"
            defaultValues={defaultValues}
          />
        </CardContent>
      </Card>
    </>
  );
}
