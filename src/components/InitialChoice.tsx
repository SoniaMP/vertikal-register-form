import { Box, Button, Paper, Typography } from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import RefreshIcon from "@mui/icons-material/Refresh";

interface InitialChoiceProps {
  onNewRegistration: () => void;
  onRenewal: () => void;
}

function InitialChoice({ onNewRegistration, onRenewal }: InitialChoiceProps) {
  return (
    <Paper
      elevation={3}
      sx={{
        p: 4,
        mt: 4,
        maxWidth: 600,
        mx: "auto",
        textAlign: "center",
      }}
    >
      <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", mb: 4 }}>
        Inscripción Club VERTIKAL
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 5 }}>
        Selecciona una opción para continuar
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
          maxWidth: 400,
          mx: "auto",
        }}
      >
        <Button
          variant="contained"
          size="large"
          onClick={onRenewal}
          startIcon={<RefreshIcon />}
          sx={{
            py: 3,
            fontSize: "1.1rem",
            textTransform: "none",
            borderRadius: 2,
          }}
        >
          Renovar licencia con el club
        </Button>

        <Button
          variant="outlined"
          size="large"
          onClick={onNewRegistration}
          startIcon={<PersonAddIcon />}
          sx={{
            py: 3,
            fontSize: "1.1rem",
            textTransform: "none",
            borderRadius: 2,
          }}
        >
          Darse de alta
        </Button>
      </Box>

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mt: 5, fontStyle: "italic" }}
      >
        Si ya eres miembro del club y quieres renovar tu licencia federativa,
        selecciona "Renovar licencia". Si eres nuevo, selecciona "Darse de alta".
      </Typography>
    </Paper>
  );
}

export default InitialChoice;
