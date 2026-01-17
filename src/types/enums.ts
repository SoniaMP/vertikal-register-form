/**
 * Enums for the application's enumerable types
 * Using const objects with types for compatibility with erasableSyntaxOnly
 */

/**
 * Steps in the registration form flow
 */
export const Step = {
  PERSONAL_DATA: 1,
  LICENSE_SELECTION: 2,
  SUMMARY: 3,
} as const;

export type Step = (typeof Step)[keyof typeof Step];

/**
 * Federation types for license registration
 */
export const FederationType = {
  FERM: "FERM",
  FMRM: "FMRM",
  FEDME: "FEDME",
  ALREADY_FEDERATED: "ALREADY_FEDERATED",
} as const;

export type FederationType =
  (typeof FederationType)[keyof typeof FederationType];

/**
 * Application mode states
 */
export const AppMode = {
  INITIAL: "initial",
  DNI_LOOKUP: "dniLookup",
  RENEWAL: "renewal",
  NEW: "new",
} as const;

export type AppMode = (typeof AppMode)[keyof typeof AppMode];

/**
 * View states for the form flow
 */
export const ViewState = {
  FORM: "form",
  CHECKOUT: "checkout",
  SUCCESS: "success",
} as const;

export type ViewState = (typeof ViewState)[keyof typeof ViewState];

/**
 * Sex/gender options
 */
export const Sex = {
  FEMALE: "FEMALE",
  MALE: "MALE",
} as const;

export type Sex = (typeof Sex)[keyof typeof Sex];
