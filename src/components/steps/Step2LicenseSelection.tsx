/**
 * Step 2: License Selection component
 */

import { memo } from "react";
import {
  Box,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  Typography,
} from "@mui/material";
import { hasFixedComplementPrice } from "../../types";
import { FederationType } from "../../types/enums";
import { licenseConfig } from "../../config/licenseConfig";

interface Step2LicenseSelectionProps {
  licenseType: string;
  selectedOption: string;
  printPhysicalCard: boolean;
  selectedComplements: Record<string, boolean>;
  onSelectedOptionChange: (value: string) => void;
  onPrintPhysicalCardChange: (checked: boolean) => void;
  onComplementChange: (key: string, checked: boolean) => void;
  onNext: (e: React.FormEvent) => void;
  onBack: () => void;
}

function Step2LicenseSelectionComponent({
  licenseType,
  selectedOption,
  printPhysicalCard,
  selectedComplements,
  onSelectedOptionChange,
  onPrintPhysicalCardChange,
  onComplementChange,
  onNext,
  onBack,
}: Step2LicenseSelectionProps) {
  if (!licenseType || licenseType === FederationType.ALREADY_FEDERATED) {
    return null;
  }

  const config = licenseConfig[licenseType as keyof typeof licenseConfig];
  if (!config) return null;

  const physicalCardPrice = config.physicalCardPrice;

  return (
    <form onSubmit={onNext}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <Box
          component="img"
          src={config.image}
          alt={`Precio de licencias ${licenseType}`}
          sx={{
            width: "100%",
            height: "auto",
            borderRadius: 1,
            mb: 2,
          }}
        />

        <FormControl fullWidth required>
          <InputLabel>Subtipo de licencia {licenseType}</InputLabel>
          <Select
            value={selectedOption}
            onChange={(e) => onSelectedOptionChange(e.target.value)}
            label={`Subtipo de licencia ${licenseType}`}
          >
            {config.options.map((option: { value: string; label: string }) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box sx={{ mt: 2 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={printPhysicalCard}
                onChange={(e) => onPrintPhysicalCardChange(e.target.checked)}
              />
            }
            label={
              <Typography variant="body1">
                Deseo imprimir tarjeta física (suplemento de {physicalCardPrice}
                €)
              </Typography>
            }
          />
        </Box>

        <ComplementsSection
          licenseType={licenseType}
          selectedComplements={selectedComplements}
          onComplementChange={onComplementChange}
        />

        <Box sx={{ display: "flex", gap: 2 }}>
          <Button variant="outlined" size="large" onClick={onBack} fullWidth>
            Volver
          </Button>
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={!selectedOption}
            fullWidth
          >
            Siguiente
          </Button>
        </Box>
      </Box>
    </form>
  );
}

interface ComplementsSectionProps {
  licenseType: string;
  selectedComplements: Record<string, boolean>;
  onComplementChange: (key: string, checked: boolean) => void;
}

const ComplementsSection = memo(function ComplementsSection({
  licenseType,
  selectedComplements,
  onComplementChange,
}: ComplementsSectionProps) {
  const config = licenseConfig[licenseType as keyof typeof licenseConfig];
  if (!config) return null;

  const isFERM = hasFixedComplementPrice(config);

  return (
    <Box sx={{ mt: 3, p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
      <Typography variant="body1" gutterBottom sx={{ fontWeight: "bold" }}>
        Complementos opcionales
        {isFERM && (
          <Typography component="span" variant="body2" color="text.secondary">
            {" "}
            (+5€ si seleccionas alguno)
          </Typography>
        )}
      </Typography>
      <Box sx={{ mt: 1 }}>
        {config.complements.map((complement: { key: string; label: string; price?: number }) => (
          <FormControlLabel
            key={complement.key}
            control={
              <Checkbox
                checked={selectedComplements[complement.key] || false}
                onChange={(e) =>
                  onComplementChange(complement.key, e.target.checked)
                }
              />
            }
            label={
              complement.price
                ? `${complement.label} (+${complement.price}€)`
                : complement.label
            }
            sx={{ display: "block" }}
          />
        ))}
      </Box>
    </Box>
  );
});

const Step2LicenseSelection = memo(Step2LicenseSelectionComponent);

export default Step2LicenseSelection;
