export type MembershipConfirmationProps = {
  firstName: string;
  lastName: string;
  email: string;
  licenseLabel: string;
  totalAmountCents: number;
  supplements: string[];
  seasonName: string;
};

export type CourseConfirmationProps = {
  firstName: string;
  lastName: string;
  email: string;
  courseTitle: string;
  coursePriceName: string;
  amountCents: number;
};

export type WelcomeProps = {
  firstName: string;
  lastName: string;
};

/** Format cents as EUR price (e.g. 1500 -> "15,00 €"). */
export function formatPrice(cents: number): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}
