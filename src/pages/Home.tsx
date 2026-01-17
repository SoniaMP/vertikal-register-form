import { Typography, Box, Paper, Alert } from "@mui/material";
import StripeCheckoutMock from "../components/StripeCheckoutMock";
import PaymentSuccess from "../components/PaymentSuccess";
import InitialChoice from "../components/InitialChoice";
import DNILookup from "../components/DNILookup";
import {
  Step1PersonalData,
  Step2LicenseSelection,
  Step3Summary,
} from "../components/steps";
import { licenseConfig } from "../config/licenseConfig";
import { useRegistrationForm } from "../hooks/useRegistrationForm";
import { AppMode, FederationType, Step, ViewState } from "../types/enums";
import { stepTitles } from "../i18n";

function Home() {
  const { state, actions, handlers } = useRegistrationForm();

  const {
    mode,
    view,
    step,
    formData,
    renewalData,
    checkoutData,
    selectedOption,
    selectedComplements,
    printPhysicalCard,
    dataProtectionAccepted,
    imageRightsAccepted,
  } = state;

  const getStepTitle = (): string => {
    if (
      step === Step.LICENSE_SELECTION &&
      formData.licenseType &&
      formData.licenseType !== FederationType.ALREADY_FEDERATED
    ) {
      const config =
        licenseConfig[formData.licenseType as keyof typeof licenseConfig];
      return config?.title || stepTitles[step];
    }
    return stepTitles[step];
  };

  // Checkout view
  if (view === ViewState.CHECKOUT && checkoutData) {
    return (
      <Box>
        <StripeCheckoutMock
          checkoutData={checkoutData}
          onSuccess={actions.paymentSuccess}
          onCancel={actions.cancelCheckout}
        />
      </Box>
    );
  }

  // Success view
  if (view === ViewState.SUCCESS && checkoutData) {
    return (
      <Box>
        <PaymentSuccess
          orderData={{
            selectedOption: checkoutData.selectedOption,
            totalPrice: checkoutData.totalPrice,
            formData: checkoutData.formData,
          }}
          onReset={actions.reset}
        />
      </Box>
    );
  }

  // Initial choice view
  if (mode === AppMode.INITIAL) {
    return (
      <Box>
        <InitialChoice
          onNewRegistration={actions.startNewRegistration}
          onRenewal={actions.startRenewalLookup}
        />
      </Box>
    );
  }

  // DNI lookup view
  if (mode === AppMode.DNI_LOOKUP) {
    return (
      <Box>
        <DNILookup
          onUserFound={actions.userFound}
          onBack={actions.backToInitial}
          onNewRegistration={actions.startNewRegistration}
        />
      </Box>
    );
  }

  // Form view (for both "new" and "renewal" modes)
  return (
    <Box>
      <Paper elevation={3} sx={{ p: 4, mt: 3, maxWidth: 600, mx: "auto" }}>
        {mode === AppMode.RENEWAL && renewalData && (
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2">
              <strong>
                Renovación de licencia para {renewalData.anioHabil}
              </strong>
            </Typography>
            <Typography variant="body2">
              Hemos cargado tus datos del año anterior. Por favor, revisa que
              todo esté correcto antes de continuar con el pago.
            </Typography>
            {renewalData.federado?.numeroLicencia && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                Licencia anterior: {renewalData.federado.numeroLicencia}
              </Typography>
            )}
          </Alert>
        )}

        <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
          Paso {step}: {getStepTitle()}
        </Typography>

        {step === Step.PERSONAL_DATA && (
          <Step1PersonalData
            formData={formData}
            dataProtectionAccepted={dataProtectionAccepted}
            imageRightsAccepted={imageRightsAccepted}
            onFormChange={handlers.handleFormChange}
            onDataProtectionChange={actions.setDataProtection}
            onImageRightsChange={actions.setImageRights}
            onNext={handlers.handleNextStep}
            onBack={handlers.handleStep1Back}
          />
        )}

        {step === Step.LICENSE_SELECTION && formData.licenseType && (
          <Step2LicenseSelection
            licenseType={formData.licenseType}
            selectedOption={selectedOption}
            printPhysicalCard={printPhysicalCard}
            selectedComplements={selectedComplements}
            onSelectedOptionChange={actions.setSelectedOption}
            onPrintPhysicalCardChange={actions.setPrintPhysicalCard}
            onComplementChange={actions.setComplement}
            onNext={handlers.handleNextStep}
            onBack={actions.prevStep}
          />
        )}

        {step === Step.SUMMARY && (
          <Step3Summary
            formData={formData}
            selectedOption={selectedOption}
            printPhysicalCard={printPhysicalCard}
            selectedComplements={selectedComplements}
            mode={mode}
            onEditPersonalData={() => actions.setStep(Step.PERSONAL_DATA)}
            onSubmit={actions.goToCheckout}
            onBack={handlers.handleStep3Back}
          />
        )}
      </Paper>
    </Box>
  );
}

export default Home;
