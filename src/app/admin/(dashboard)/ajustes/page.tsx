import { getMembershipFee } from "@/lib/settings";
import { MembershipFeeForm } from "@/components/admin/membership-fee-form";

export default async function AjustesPage() {
  const membershipFeeCents = await getMembershipFee();
  const membershipFeeEuros = membershipFeeCents / 100;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Ajustes</h1>
      <MembershipFeeForm currentFeeEuros={membershipFeeEuros} />
    </div>
  );
}
