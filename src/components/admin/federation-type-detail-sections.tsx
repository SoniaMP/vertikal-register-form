import type { FederationTypeWithRelations } from "./federation-types-table";
import { SubtypesSection } from "./subtypes-section";
import { SupplementsSection } from "./supplements-section";
import { CategoriesSection } from "./categories-section";
import { SupplementGroupsSection } from "./supplement-groups-section";

type Props = {
  federationType: FederationTypeWithRelations;
};

export function DetailSections({ federationType: ft }: Props) {
  return (
    <>
      <SubtypesSection federationTypeId={ft.id} subtypes={ft.subtypes} />
      <CategoriesSection
        federationTypeId={ft.id}
        categories={ft.categories}
        subtypes={ft.subtypes}
      />
      <SupplementGroupsSection
        federationTypeId={ft.id}
        supplementGroups={ft.supplementGroups}
      />
      <SupplementsSection
        federationTypeId={ft.id}
        supplements={ft.supplements}
        supplementGroups={ft.supplementGroups}
      />
    </>
  );
}
