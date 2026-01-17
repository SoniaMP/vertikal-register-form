/**
 * License configuration for each federation type
 */

import { FederationType } from "../types/enums";
import type { LicenseConfigMap } from "../types";
import precioLicenciasFERM from "../assets/precio-licencias-ferm.png";
import precioLicenciasFMRM from "../assets/precio-licencias-fmrm.png";
import precioLicenciasFEDME from "../assets/precio-licencias-fedme.png";

/**
 * Configuration for all federation license types
 */
export const licenseConfig: LicenseConfigMap = {
  [FederationType.FERM]: {
    title: "Licencia FERM - Federación de Espeleología de la Región de Murcia",
    image: precioLicenciasFERM,
    physicalCardPrice: 3,
    options: [
      { value: "FERM_BASICA_A", label: "Básica A" },
      { value: "FERM_BASICA_B", label: "Básica B" },
      { value: "FERM_BASICA_B1", label: "Básica B1" },
      { value: "FERM_PLUS_A", label: "Plus A" },
      { value: "FERM_PLUS_B", label: "Plus B" },
      { value: "FERM_PLUS_B1", label: "Plus B1" },
      { value: "FERM_HABILITACION", label: "Habilitación" },
    ],
    complementsFixedPrice: 5,
    complements: [
      { key: "technician", label: "Técnico" },
      { key: "referee", label: "Árbitro" },
      { key: "caveRescuer", label: "Espeleosocorrista" },
    ],
  },
  [FederationType.FMRM]: {
    title: "Licencia FMRM - Federación de Montañismo de la Región de Murcia",
    image: precioLicenciasFMRM,
    physicalCardPrice: 2,
    options: [
      {
        value: "FMRM_A",
        label:
          "A (España, Andorra, Pirineo Francés, Portugal y Marruecos - Sólo excursionismo, montañismo, senderismo, marcha nórdica, campamentos y marchas)",
      },
      {
        value: "FMRM_B",
        label: "B (España, Andorra, Pirineo Francés, Portugal y Marruecos)",
      },
      { value: "FMRM_C", label: "C (Europa y Marruecos)" },
      {
        value: "FMRM_D",
        label: "D (Mundial hasta 7.000m, sin excursiones polares)",
      },
      {
        value: "FMRM_E",
        label: "E (Expediciones polares y montañas de más de 7.000m)",
      },
      {
        value: "FMRM_OT",
        label:
          "OT (Octubre y Diciembre en España, Andorra, Pirineo Francés, Portugal y Marruecos)",
      },
      {
        value: "FMRM_AU",
        label: "AU (Región de Murcia - NO válida para competición)",
      },
      { value: "FMRM_HABILITACION", label: "Habilitación" },
    ],
    complements: [
      { key: "mountainBike", label: "Bicicleta de montaña", price: 9 },
      { key: "alpineSki", label: "Esquí alpino", price: 35.5 },
      { key: "snow", label: "Snow", price: 49 },
    ],
  },
  [FederationType.FEDME]: {
    title:
      "Licencia FEDME - Federación Española de Deportes de Montaña y Escalada",
    image: precioLicenciasFEDME,
    physicalCardPrice: 2,
    options: [
      {
        value: "FEDME_A",
        label:
          "A (España, Andorra, Pirineo Francés, Portugal y Marruecos - Sólo excursionismo, montañismo, senderismo, marcha nórdica, campamentos y marchas)",
      },
      {
        value: "FEDME_B",
        label: "B (España, Andorra, Pirineo Francés, Portugal y Marruecos)",
      },
      { value: "FEDME_C", label: "C (Europa y Marruecos)" },
      {
        value: "FEDME_D",
        label: "D (Mundial hasta 7.000m, sin excursiones polares)",
      },
      {
        value: "FEDME_E",
        label: "E (Expediciones polares y montañas de más de 7.000m)",
      },
      {
        value: "FEDME_OT",
        label:
          "OT (Octubre y Diciembre en España, Andorra, Pirineo Francés, Portugal y Marruecos)",
      },
    ],
    complements: [
      { key: "mountainBike", label: "Bicicleta de montaña", price: 9 },
      { key: "alpineSki", label: "Esquí alpino", price: 35.5 },
      { key: "snow", label: "Snow", price: 49 },
    ],
  },
};

/**
 * Get license configuration for a federation type
 */
export function getLicenseConfig(federationType: FederationType) {
  if (federationType === FederationType.ALREADY_FEDERATED) {
    return null;
  }
  return licenseConfig[federationType as keyof LicenseConfigMap];
}
