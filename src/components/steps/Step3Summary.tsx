/**
 * Step 3: Summary and Payment component
 * Handles its own price fetching to avoid unnecessary re-renders in parent
 */

import { memo, useState, useEffect } from "react";
import { Box, Button, Typography, CircularProgress } from "@mui/material";
import type { RegistrationFormData, CheckoutData } from "../../types";
import { AppMode } from "../../types/enums";
import { stripeService } from "../../services/stripeService";
import {
  isAlreadyFederated,
  getSelectedOptionLabel,
  getPhysicalCardPrice,
  getClubFee,
  getComplementsTotal,
  formatComplementsForDisplay,
  calculateTotalPrice,
} from "../../utils/licenseUtils";

interface Step3SummaryProps {
  formData: RegistrationFormData;
  selectedOption: string;
  printPhysicalCard: boolean;
  selectedComplements: Record<string, boolean>;
  mode: AppMode;
  onEditPersonalData: () => void;
  onSubmit: (checkoutData: CheckoutData) => void;
  onBack: () => void;
}

function Step3SummaryComponent({
  formData,
  selectedOption,
  printPhysicalCard,
  selectedComplements,
  mode,
  onEditPersonalData,
  onSubmit,
  onBack,
}: Step3SummaryProps) {
  const [price, setPrice] = useState<number | null>(null);
  const [loadingPrice, setLoadingPrice] = useState(false);

  const alreadyFederated = isAlreadyFederated(formData.licenseType);
  const clubFee = getClubFee();
  const physicalCardPrice = getPhysicalCardPrice(formData.licenseType);
  const complementsTotal = getComplementsTotal(
    formData.licenseType,
    selectedComplements
  );
  const totalPrice = calculateTotalPrice(
    formData.licenseType,
    price,
    printPhysicalCard,
    selectedComplements
  );

  // Fetch price only when this component mounts or selectedOption changes
  useEffect(() => {
    if (alreadyFederated || !selectedOption) {
      return;
    }

    let cancelled = false;

    const fetchPrice = async () => {
      setLoadingPrice(true);
      const calculatedPrice = await stripeService.getPriceForLicense(
        selectedOption
      );
      if (!cancelled) {
        setPrice(calculatedPrice);
        setLoadingPrice(false);
      }
    };

    fetchPrice();

    return () => {
      cancelled = true;
    };
  }, [selectedOption, alreadyFederated]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const checkoutData: CheckoutData = {
      selectedOption,
      printPhysicalCard,
      physicalCardPrice,
      selectedComplements,
      complementsTotal,
      licensePrice: price || 0,
      clubFee,
      totalPrice: totalPrice || 0,
      formData,
    };

    onSubmit(checkoutData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <Typography variant="h6" gutterBottom>
          Resumen de tu solicitud
        </Typography>

        <PersonalDataSummary
          formData={formData}
          mode={mode}
          onEditPersonalData={onEditPersonalData}
        />

        {alreadyFederated ? (
          <AlreadyFederatedSummary />
        ) : (
          <LicenseSummary
            formData={formData}
            selectedOption={selectedOption}
            printPhysicalCard={printPhysicalCard}
            selectedComplements={selectedComplements}
          />
        )}

        {!alreadyFederated && loadingPrice && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <CircularProgress size={24} />
            <Typography variant="body1">Calculando precio...</Typography>
          </Box>
        )}

        {(alreadyFederated || (!loadingPrice && totalPrice !== null)) && (
          <PriceSummary
            alreadyFederated={alreadyFederated}
            price={price}
            clubFee={clubFee}
            printPhysicalCard={printPhysicalCard}
            physicalCardPrice={physicalCardPrice}
            complementsTotal={complementsTotal}
            totalPrice={totalPrice}
          />
        )}

        <Box sx={{ display: "flex", gap: 2 }}>
          <Button variant="outlined" size="large" onClick={onBack} fullWidth>
            {mode === AppMode.RENEWAL ? "Cancelar" : "Volver"}
          </Button>
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={!alreadyFederated && (loadingPrice || !price)}
            fullWidth
          >
            Pagar
          </Button>
        </Box>
      </Box>
    </form>
  );
}

interface PersonalDataSummaryProps {
  formData: RegistrationFormData;
  mode: AppMode;
  onEditPersonalData: () => void;
}

const PersonalDataSummary = memo(function PersonalDataSummary({
  formData,
  mode,
  onEditPersonalData,
}: PersonalDataSummaryProps) {
  const isRenewal = mode === AppMode.RENEWAL;

  return (
    <Box sx={{ p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
          Datos personales
        </Typography>
        {isRenewal && (
          <Button size="small" onClick={onEditPersonalData}>
            Editar datos
          </Button>
        )}
      </Box>
      <Typography variant="body2">
        <strong>Nombre:</strong> {formData.fullName}
      </Typography>
      <Typography variant="body2">
        <strong>Email:</strong> {formData.email}
      </Typography>
      <Typography variant="body2">
        <strong>DNI:</strong> {formData.dni}
      </Typography>
      <Typography variant="body2">
        <strong>Teléfono:</strong> {formData.phone}
      </Typography>
      {isRenewal && (
        <>
          <Typography variant="body2">
            <strong>Dirección:</strong> {formData.address}
          </Typography>
          <Typography variant="body2">
            <strong>Código postal:</strong> {formData.postalCode}
          </Typography>
          <Typography variant="body2">
            <strong>Población:</strong> {formData.city}
          </Typography>
          <Typography variant="body2">
            <strong>Fecha de nacimiento:</strong> {formData.birthDate}
          </Typography>
          <Typography variant="body2">
            <strong>Sexo:</strong> {formData.sex}
          </Typography>
        </>
      )}
    </Box>
  );
});

const AlreadyFederatedSummary = memo(function AlreadyFederatedSummary() {
  return (
    <Box sx={{ p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 2 }}>
        Tipo de inscripción
      </Typography>
      <Typography variant="body2">
        <strong>Estado:</strong> Ya estoy federado
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        Solo se cobrará la cuota del club.
      </Typography>
    </Box>
  );
});

interface LicenseSummaryProps {
  formData: RegistrationFormData;
  selectedOption: string;
  printPhysicalCard: boolean;
  selectedComplements: Record<string, boolean>;
}

const LicenseSummary = memo(function LicenseSummary({
  formData,
  selectedOption,
  printPhysicalCard,
  selectedComplements,
}: LicenseSummaryProps) {
  const optionLabel = getSelectedOptionLabel(
    formData.licenseType,
    selectedOption
  );
  const physicalCardPrice = getPhysicalCardPrice(formData.licenseType);
  const complementsDisplay = formatComplementsForDisplay(
    formData.licenseType,
    selectedComplements
  );

  return (
    <Box sx={{ p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 2 }}>
        Licencia seleccionada
      </Typography>
      <Typography variant="body2">
        <strong>Federación:</strong> {formData.licenseType}
      </Typography>
      <Typography variant="body2">
        <strong>Tipo de licencia:</strong> {optionLabel}
      </Typography>
      {printPhysicalCard && (
        <Typography variant="body2">
          <strong>Tarjeta física:</strong> Sí (+{physicalCardPrice}€)
        </Typography>
      )}
      {complementsDisplay && (
        <Typography variant="body2">
          <strong>Complementos:</strong> {complementsDisplay}
        </Typography>
      )}
    </Box>
  );
});

interface PriceSummaryProps {
  alreadyFederated: boolean;
  price: number | null;
  clubFee: number;
  printPhysicalCard: boolean;
  physicalCardPrice: number;
  complementsTotal: number;
  totalPrice: number | null;
}

const PriceSummary = memo(function PriceSummary({
  alreadyFederated,
  price,
  clubFee,
  printPhysicalCard,
  physicalCardPrice,
  complementsTotal,
  totalPrice,
}: PriceSummaryProps) {
  return (
    <Box sx={{ p: 2, bgcolor: "primary.light", borderRadius: 1 }}>
      {!alreadyFederated && (
        <Typography variant="body2" color="white">
          Precio licencia: {price}€
        </Typography>
      )}
      <Typography variant="body2" color="white">
        Cuota del club: {clubFee}€
      </Typography>
      {!alreadyFederated && printPhysicalCard && (
        <Typography variant="body2" color="white">
          Suplemento tarjeta física: {physicalCardPrice}€
        </Typography>
      )}
      {!alreadyFederated && complementsTotal > 0 && (
        <Typography variant="body2" color="white">
          Suplemento complementos: {complementsTotal}€
        </Typography>
      )}
      <Typography variant="h5" color="white" sx={{ mt: 1, fontWeight: "bold" }}>
        Total: {totalPrice}€
      </Typography>
    </Box>
  );
});

const Step3Summary = memo(Step3SummaryComponent);

export default Step3Summary;
