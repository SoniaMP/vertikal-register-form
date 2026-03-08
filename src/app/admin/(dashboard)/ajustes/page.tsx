import { getMembershipFee } from "@/lib/settings";
import { getEmailBranding } from "@/lib/email-branding";
import { MembershipFeeForm } from "@/components/admin/membership-fee-form";
import { EmailBrandingForm } from "@/components/admin/email-branding-form";

export default async function AjustesPage() {
  const [membershipFeeCents, branding] = await Promise.all([
    getMembershipFee(),
    getEmailBranding(),
  ]);
  const membershipFeeEuros = membershipFeeCents / 100;

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Ajustes</h1>
      <MembershipFeeForm currentFeeEuros={membershipFeeEuros} />
      <EmailBrandingForm branding={branding} />
    </div>
  );
}
