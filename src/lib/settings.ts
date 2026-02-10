import { prisma } from "@/lib/prisma";

const DEFAULT_MEMBERSHIP_FEE = 2000; // 20.00 EUR in cents

export async function getMembershipFee(): Promise<number> {
  const setting = await prisma.appSetting.findUnique({
    where: { key: "MEMBERSHIP_FEE" },
  });

  if (!setting) return DEFAULT_MEMBERSHIP_FEE;

  const parsed = parseInt(setting.value, 10);
  return Number.isFinite(parsed) && parsed >= 0
    ? parsed
    : DEFAULT_MEMBERSHIP_FEE;
}
