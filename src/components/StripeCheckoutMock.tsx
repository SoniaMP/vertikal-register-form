import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Divider,
  CircularProgress,
} from "@mui/material";
import { useState } from "react";

interface CheckoutData {
  selectedOption: string;
  printPhysicalCard: boolean;
  physicalCardPrice: number;
  selectedComplements: Record<string, boolean>;
  complementsTotal: number;
  licensePrice: number;
  clubFee: number;
  totalPrice: number;
  formData: any;
}

interface StripeCheckoutMockProps {
  checkoutData: CheckoutData;
  onSuccess: () => void;
  onCancel: () => void;
}

function StripeCheckoutMock({
  checkoutData,
  onSuccess,
  onCancel,
}: StripeCheckoutMockProps) {
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardName, setCardName] = useState("");
  const [processing, setProcessing] = useState(false);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setProcessing(false);
    onSuccess();
  };

  const cardSupplement = checkoutData.printPhysicalCard ? checkoutData.physicalCardPrice : 0;
  const complementsTotal = checkoutData.complementsTotal;

  return (
    <Paper elevation={3} sx={{ p: 4, mt: 3, maxWidth: 600, mx: "auto" }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold" }}>
        Pasarela de pago
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Simulación de pago con Stripe (Modo Test)
      </Typography>

      <Divider sx={{ my: 3 }} />

      {/* Order Summary */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
          Resumen de la compra
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography variant="body1">
              Licencia {checkoutData.selectedOption}
            </Typography>
            <Typography variant="body1">
              {checkoutData.licensePrice}€
            </Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Cuota del club
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {checkoutData.clubFee}€
            </Typography>
          </Box>
          {checkoutData.printPhysicalCard && (
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <Typography variant="body2" color="text.secondary">
                Tarjeta física
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {cardSupplement}€
              </Typography>
            </Box>
          )}
          {complementsTotal > 0 && (
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <Typography variant="body2" color="text.secondary">
                Complementos
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {complementsTotal}€
              </Typography>
            </Box>
          )}
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Total
            </Typography>
            <Typography
              variant="h6"
              color="primary"
              sx={{ fontWeight: "bold" }}
            >
              {checkoutData.totalPrice}€
            </Typography>
          </Box>
        </Box>
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Payment Form */}
      <form onSubmit={handlePayment}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
            Información de pago
          </Typography>

          <TextField
            label="Número de tarjeta"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            placeholder="•••• •••• •••• ••••"
            required
            fullWidth
            inputProps={{ maxLength: 19, autoComplete: "cc-number" }}
          />

          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              label="Fecha de expiración"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              placeholder="MM/AA"
              required
              fullWidth
              inputProps={{ maxLength: 5 }}
            />
            <TextField
              label="CVV"
              type="password"
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
              placeholder="•••"
              required
              fullWidth
              inputProps={{ maxLength: 4, autoComplete: "cc-csc" }}
            />
          </Box>

          <TextField
            label="Nombre del titular"
            value={cardName}
            onChange={(e) => setCardName(e.target.value)}
            placeholder="Nombre completo"
            required
            fullWidth
          />

          <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
            <Button
              variant="outlined"
              size="large"
              onClick={onCancel}
              fullWidth
              disabled={processing}
            >
              CANCELAR
            </Button>
            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={processing}
            >
              {processing ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                `PAGAR ${checkoutData.totalPrice}€`
              )}
            </Button>
          </Box>
        </Box>
      </form>
    </Paper>
  );
}

export default StripeCheckoutMock;
