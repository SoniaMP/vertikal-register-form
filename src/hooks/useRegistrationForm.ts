/**
 * Custom hook for managing registration form state
 * Uses useReducer to consolidate all form-related state
 */

import { useReducer, useCallback, useMemo } from "react";
import {
  type CheckoutData,
  type RegistrationFormData,
  INITIAL_FORM_DATA,
} from "../types";
import { FederationType, Step, ViewState } from "../types/enums";

// ============================================================================
// State Type
// ============================================================================

export interface RegistrationState {
  view: ViewState;
  step: Step;
  formData: RegistrationFormData;
  checkoutData: CheckoutData | null;
  selectedOption: string;
  selectedComplements: Record<string, boolean>;
  printPhysicalCard: boolean;
  dataProtectionAccepted: boolean;
  imageRightsAccepted: boolean;
}

const initialState: RegistrationState = {
  view: ViewState.FORM,
  step: Step.PERSONAL_DATA,
  formData: INITIAL_FORM_DATA,
  checkoutData: null,
  selectedOption: "",
  selectedComplements: {},
  printPhysicalCard: false,
  dataProtectionAccepted: false,
  imageRightsAccepted: false,
};

// ============================================================================
// Action Types
// ============================================================================

type RegistrationAction =
  | { type: "RESET" }
  | { type: "SET_VIEW"; payload: ViewState }
  | { type: "SET_STEP"; payload: Step }
  | { type: "UPDATE_FORM_FIELD"; payload: { name: string; value: string } }
  | { type: "SET_DATA_PROTECTION"; payload: boolean }
  | { type: "SET_IMAGE_RIGHTS"; payload: boolean }
  | { type: "SET_SELECTED_OPTION"; payload: string }
  | { type: "SET_COMPLEMENT"; payload: { key: string; checked: boolean } }
  | { type: "SET_PRINT_PHYSICAL_CARD"; payload: boolean }
  | { type: "SET_CHECKOUT_DATA"; payload: CheckoutData }
  | { type: "NEXT_STEP" }
  | { type: "PREV_STEP" }
  | { type: "GO_TO_CHECKOUT"; payload: CheckoutData }
  | { type: "PAYMENT_SUCCESS" }
  | { type: "CANCEL_CHECKOUT" };

// ============================================================================
// Reducer
// ============================================================================

function registrationReducer(
  state: RegistrationState,
  action: RegistrationAction
): RegistrationState {
  switch (action.type) {
    case "RESET":
      return initialState;

    case "SET_VIEW":
      return { ...state, view: action.payload };

    case "SET_STEP":
      return { ...state, step: action.payload };

    case "UPDATE_FORM_FIELD":
      return {
        ...state,
        formData: {
          ...state.formData,
          [action.payload.name]: action.payload.value,
        },
      };

    case "SET_DATA_PROTECTION":
      return { ...state, dataProtectionAccepted: action.payload };

    case "SET_IMAGE_RIGHTS":
      return { ...state, imageRightsAccepted: action.payload };

    case "SET_SELECTED_OPTION":
      return { ...state, selectedOption: action.payload };

    case "SET_COMPLEMENT":
      return {
        ...state,
        selectedComplements: {
          ...state.selectedComplements,
          [action.payload.key]: action.payload.checked,
        },
      };

    case "SET_PRINT_PHYSICAL_CARD":
      return { ...state, printPhysicalCard: action.payload };

    case "SET_CHECKOUT_DATA":
      return { ...state, checkoutData: action.payload };

    case "NEXT_STEP": {
      // If already federated, skip directly to step 3
      if (
        state.step === Step.PERSONAL_DATA &&
        state.formData.licenseType === FederationType.ALREADY_FEDERATED
      ) {
        return { ...state, step: Step.SUMMARY };
      }
      return { ...state, step: (state.step + 1) as Step };
    }

    case "PREV_STEP": {
      // If already federated and on step 3, go back to step 1
      if (
        state.step === Step.SUMMARY &&
        state.formData.licenseType === FederationType.ALREADY_FEDERATED
      ) {
        return { ...state, step: Step.PERSONAL_DATA };
      }
      return { ...state, step: (state.step - 1) as Step };
    }

    case "GO_TO_CHECKOUT":
      return {
        ...state,
        view: ViewState.CHECKOUT,
        checkoutData: action.payload,
      };

    case "PAYMENT_SUCCESS":
      return { ...state, view: ViewState.SUCCESS };

    case "CANCEL_CHECKOUT":
      return { ...state, view: ViewState.FORM };

    default:
      return state;
  }
}

// ============================================================================
// Hook
// ============================================================================

export function useRegistrationForm() {
  const [state, dispatch] = useReducer(registrationReducer, initialState);

  // Memoized action creators
  const actions = useMemo(
    () => ({
      reset: () => dispatch({ type: "RESET" }),

      setStep: (step: Step) => dispatch({ type: "SET_STEP", payload: step }),

      updateFormField: (name: string, value: string) =>
        dispatch({ type: "UPDATE_FORM_FIELD", payload: { name, value } }),

      setDataProtection: (accepted: boolean) =>
        dispatch({ type: "SET_DATA_PROTECTION", payload: accepted }),

      setImageRights: (accepted: boolean) =>
        dispatch({ type: "SET_IMAGE_RIGHTS", payload: accepted }),

      setSelectedOption: (option: string) =>
        dispatch({ type: "SET_SELECTED_OPTION", payload: option }),

      setComplement: (key: string, checked: boolean) =>
        dispatch({ type: "SET_COMPLEMENT", payload: { key, checked } }),

      setPrintPhysicalCard: (print: boolean) =>
        dispatch({ type: "SET_PRINT_PHYSICAL_CARD", payload: print }),

      nextStep: () => dispatch({ type: "NEXT_STEP" }),

      prevStep: () => dispatch({ type: "PREV_STEP" }),

      goToCheckout: (data: CheckoutData) =>
        dispatch({ type: "GO_TO_CHECKOUT", payload: data }),

      paymentSuccess: () => dispatch({ type: "PAYMENT_SUCCESS" }),

      cancelCheckout: () => dispatch({ type: "CANCEL_CHECKOUT" }),
    }),
    []
  );

  // Event handlers that need special handling
  const handlers = {
    handleFormChange: useCallback(
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        actions.updateFormField(e.target.name, e.target.value);
      },
      [actions]
    ),

    handleNextStep: useCallback(
      (e: React.FormEvent) => {
        e.preventDefault();
        actions.nextStep();
      },
      [actions]
    ),
  };

  return {
    state,
    actions,
    handlers,
  };
}
