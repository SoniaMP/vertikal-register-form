import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { usuariosService, type RenewalData } from "../services/usuariosService";

interface DNILookupProps {
  onUserFound: (data: RenewalData) => void;
  onBack: () => void;
  onNewRegistration: () => void;
}

function DNILookup({ onUserFound, onBack, onNewRegistration }: DNILookupProps) {
  const [dni, setDni] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!dni.trim()) {
      setError("Por favor, introduce tu DNI.");
      return;
    }

    // Basic DNI format validation
    const dniRegex = /^[0-9]{8}[A-Za-z]$/;
    const nieRegex = /^[XYZxyz][0-9]{7}[A-Za-z]$/;

    if (!dniRegex.test(dni) && !nieRegex.test(dni)) {
      setError("El formato del DNI/NIE no es válido. Ejemplo: 12345678A");
      return;
    }

    setLoading(true);

    try {
      const renewalData = await usuariosService.getByDNI(dni);
      onUserFound(renewalData);
    } catch (err) {
      const message = err instanceof Error ? err.message : "No se encontró el usuario.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 4,
        mt: 4,
        maxWidth: 500,
        mx: "auto",
        textAlign: "center",
      }}
    >
      <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold", mb: 3 }}>
        Renovar licencia
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Introduce tu DNI para cargar tus datos y renovar tu licencia
      </Typography>

      <form onSubmit={handleSearch}>
        <TextField
          label="DNI / NIE"
          value={dni}
          onChange={(e) => {
            setDni(e.target.value.toUpperCase());
            setError(null);
          }}
          placeholder="12345678A"
          fullWidth
          autoFocus
          disabled={loading}
          inputProps={{
            maxLength: 9,
            style: { textTransform: "uppercase" },
          }}
          sx={{ mb: 3 }}
        />

        {error && (
          <Alert severity="error" sx={{ mb: 3, textAlign: "left" }}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="outlined"
            size="large"
            onClick={onBack}
            startIcon={<ArrowBackIcon />}
            disabled={loading}
            sx={{ flex: 1 }}
          >
            Volver
          </Button>

          <Button
            type="submit"
            variant="contained"
            size="large"
            startIcon={loading ? undefined : <SearchIcon />}
            disabled={loading || !dni.trim()}
            sx={{ flex: 1 }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Buscar"
            )}
          </Button>
        </Box>
      </form>

      <Box sx={{ mt: 4, pt: 3, borderTop: 1, borderColor: "divider" }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          ¿No encuentras tus datos o eres nuevo en el club?
        </Typography>
        <Button
          variant="text"
          onClick={onNewRegistration}
          sx={{ textTransform: "none" }}
        >
          Darme de alta como nuevo socio
        </Button>
      </Box>
    </Paper>
  );
}

export default DNILookup;
