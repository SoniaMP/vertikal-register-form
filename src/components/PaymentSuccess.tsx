import { Box, Paper, Typography, Button } from "@mui/material";

interface PaymentSuccessProps {
  orderData: {
    selectedOption: string;
    totalPrice: number;
    formData: any;
  };
  onReset: () => void;
}

function PaymentSuccess({ orderData, onReset }: PaymentSuccessProps) {
  return (
    <Paper elevation={3} sx={{ p: 4, mt: 3, maxWidth: 600, mx: "auto" }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 3,
        }}
      >
        <Box
          sx={{
            fontSize: 80,
            color: "success.main",
            lineHeight: 1,
          }}
        >
          ✓
        </Box>

        <Typography
          variant="h4"
          gutterBottom
          sx={{ fontWeight: "bold", textAlign: "center" }}
        >
          ¡Pago realizado con éxito!
        </Typography>

        <Typography variant="body1" color="text.secondary" textAlign="center">
          Tu registro ha sido procesado correctamente. Recibirás un correo de
          confirmación en breve.
        </Typography>

        <Box
          sx={{
            width: "100%",
            p: 3,
            bgcolor: "grey.50",
            borderRadius: 1,
            mt: 2,
          }}
        >
          <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
            Detalles de la compra
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <Typography variant="body2" color="text.secondary">
                Nombre:
              </Typography>
              <Typography variant="body2">
                {orderData.formData.fullName}
              </Typography>
            </Box>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <Typography variant="body2" color="text.secondary">
                Email:
              </Typography>
              <Typography variant="body2">
                {orderData.formData.email}
              </Typography>
            </Box>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <Typography variant="body2" color="text.secondary">
                Tipo de licencia:
              </Typography>
              <Typography variant="body2">
                {orderData.selectedOption}
              </Typography>
            </Box>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}
            >
              <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                Total pagado:
              </Typography>
              <Typography
                variant="body1"
                color="primary"
                sx={{ fontWeight: "bold" }}
              >
                {orderData.totalPrice}€
              </Typography>
            </Box>
          </Box>
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          textAlign="center"
          sx={{ mt: 2 }}
        >
          ID de transacción: MOCK-{Date.now()}
        </Typography>

        <Button
          variant="contained"
          size="large"
          onClick={onReset}
          sx={{ mt: 2 }}
        >
          NUEVA INSCRIPCIÓN
        </Button>
      </Box>
    </Paper>
  );
}

export default PaymentSuccess;
