import { Typography, Box, Paper } from "@mui/material";
import StripeCheckoutMock from "../components/StripeCheckoutMock";
import PaymentSuccess from "../components/PaymentSuccess";
import {
  Step1PersonalData,
  Step2LicenseSelection,
  Step3Summary,
} from "../components/steps";
import { licenseConfig } from "../config/licenseConfig";
import { useRegistrationForm } from "../hooks/useRegistrationForm";
import { FederationType, Step, ViewState } from "../types/enums";
import { stepTitles } from "../i18n";

function Home() {
  const { state, actions, handlers } = useRegistrationForm();

  const {
    view,
    step,
    formData,
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

  // Form view
  return (
    <Box>
      <Paper elevation={3} sx={{ p: 4, mt: 3, maxWidth: 600, mx: "auto" }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
          {getStepTitle()}
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
            onSubmit={actions.goToCheckout}
            onBack={actions.prevStep}
          />
        )}
      </Paper>
    </Box>
  );
}

export default Home;
