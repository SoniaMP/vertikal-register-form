/**
 * Spanish translations for the application
 */

import { FederationType, Sex, Step } from "../types/enums";

/**
 * Step titles
 */
export const stepTitles: Record<Step, string> = {
  [Step.PERSONAL_DATA]: "Datos personales",
  [Step.LICENSE_SELECTION]: "Elección licencia",
  [Step.SUMMARY]: "Resumen y pago",
};

/**
 * Sex/gender labels
 */
export const sexLabels: Record<Sex, string> = {
  [Sex.FEMALE]: "Mujer",
  [Sex.MALE]: "Hombre",
};

/**
 * Federation type labels
 */
export const federationTypeLabels: Record<FederationType, string> = {
  [FederationType.FERM]: "Federarme en FERM",
  [FederationType.FMRM]: "Federarme en FMRM",
  [FederationType.FEDME]: "Federarme en FEDME",
  [FederationType.ALREADY_FEDERATED]: "Ya estoy federado",
};

/**
 * Common labels
 */
export const labels = {
  // Form fields
  fullName: "Nombre completo (nombre + apellidos)",
  email: "Correo electrónico",
  address: "Dirección completa",
  postalCode: "Código postal",
  city: "Población",
  birthDate: "Fecha de nacimiento",
  dni: "DNI",
  phone: "Teléfono",
  sex: "Sexo",
  federationType: "Tipo de federativa",
  licenseSubtype: "Subtipo de licencia",

  // Buttons
  next: "Siguiente",
  back: "Volver",
  cancel: "Cancelar",
  pay: "Pagar",
  newRegistration: "Nueva inscripción",

  // Data protection
  dataProtection: "Protección de datos",
  personalDataProtection: "Protección de datos personales",
  dataProtectionText:
    "De conformidad con lo dispuesto en el Reglamento (UE) 2016/679 (RGPD) y en la Ley Orgánica 3/2018, se informa de que los datos personales facilitados en la presente ficha serán tratados por VERTIKAL, con domicilio en C/ Espronceda, 16 2-B, CP 30140, Santomera (Murcia), en su condición de responsable del tratamiento.",
  purposeAndLegalBasis: "Finalidad y base jurídica del tratamiento",
  purposeText:
    "Los datos serán tratados con la finalidad de gestionar la inscripción del interesado y la organización y desarrollo de las actividades del club, siendo la base legal la ejecución de la relación asociativa (art. 6.1.b RGPD).",
  dataTransfer: "Cesión de datos",
  dataTransferText:
    "Para la tramitación de licencias y seguros deportivos, los datos necesarios serán comunicados a la Federación de Montañismo de la Región de Murcia y/o a la Federación de Espeleología de la Región de Murcia, así como a sus respectivas entidades aseguradoras. Dicha cesión resulta necesaria para la participación en las actividades federadas.",
  imageRights: "Tratamiento de imágenes (consentimiento)",
  imageRightsText:
    "Autorizo el uso de mi imagen obtenida durante las actividades del club para su publicación en la página web, redes sociales y otros medios de difusión propios del club, siempre con fines informativos y sin finalidad comercial.",
  dataSubjectRights: "Derechos del interesado",
  dataSubjectRightsText:
    "El interesado podrá ejercer los derechos de acceso, rectificación, supresión, oposición, limitación del tratamiento y portabilidad, así como retirar el consentimiento en cualquier momento, mediante solicitud escrita dirigida a VERTIKAL en la dirección indicada o al correo electrónico gestion@clubvertikal.es",
  acceptDataProtection: "He leído y acepto la política de protección de datos",
  authorizeImageUse: "Autorizo el uso de mi imagen según lo indicado",

  // License selection
  physicalCardDesire: "Deseo imprimir tarjeta física",
  physicalCardSupplement: "suplemento de",
  optionalComplements: "Complementos opcionales",
  complementsFixedPrice: "+5€ si seleccionas alguno",

  // Summary
  requestSummary: "Resumen de tu solicitud",
  personalData: "Datos personales",
  editData: "Editar datos",
  name: "Nombre",
  registrationType: "Tipo de inscripción",
  alreadyFederated: "Ya estoy federado",
  onlyClubFee: "Solo se cobrará la cuota del club.",
  selectedLicense: "Licencia seleccionada",
  federation: "Federación",
  licenseType: "Tipo de licencia",
  physicalCard: "Tarjeta física",
  yes: "Sí",
  complements: "Complementos",
  calculatingPrice: "Calculando precio...",
  licensePrice: "Precio licencia",
  clubFee: "Cuota del club",
  physicalCardSup: "Suplemento tarjeta física",
  complementsSup: "Suplemento complementos",
  total: "Total",

  // Checkout
  paymentGateway: "Pasarela de pago",
  stripeTestMode: "Simulación de pago con Stripe (Modo Test)",
  purchaseSummary: "Resumen de la compra",
  license: "Licencia",
  paymentInfo: "Información de pago",
  cardNumber: "Número de tarjeta",
  expiryDate: "Fecha de expiración",
  cvv: "CVV",
  cardholderName: "Nombre del titular",

  // Success
  paymentSuccess: "¡Pago realizado con éxito!",
  registrationProcessed:
    "Tu registro ha sido procesado correctamente. Recibirás un correo de confirmación en breve.",
  purchaseDetails: "Detalles de la compra",
  totalPaid: "Total pagado",
  transactionId: "ID de transacción",

  // Renewal
  licenseRenewalFor: "Renovación de licencia para",
  dataLoadedFromLastYear:
    "Hemos cargado tus datos del año anterior. Por favor, revisa que todo esté correcto antes de continuar con el pago.",
  previousLicense: "Licencia anterior",
};
