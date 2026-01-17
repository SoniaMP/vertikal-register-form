/**
 * Step 1: Personal Data form component
 */

import { memo } from "react";
import {
  Box,
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  Typography,
} from "@mui/material";
import type { FormData } from "../../types/interfaces";
import { FederationType, Sex } from "../../types/enums";

interface Step1PersonalDataProps {
  formData: FormData;
  dataProtectionAccepted: boolean;
  imageRightsAccepted: boolean;
  onFormChange: (e: any) => void;
  onDataProtectionChange: (checked: boolean) => void;
  onImageRightsChange: (checked: boolean) => void;
  onNext: (e: React.FormEvent) => void;
  onBack: () => void;
}

function Step1PersonalDataComponent({
  formData,
  dataProtectionAccepted,
  imageRightsAccepted,
  onFormChange,
  onDataProtectionChange,
  onImageRightsChange,
  onNext,
  onBack,
}: Step1PersonalDataProps) {
  return (
    <form onSubmit={onNext}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <TextField
          label="Nombre completo (nombre + apellidos)"
          name="fullName"
          value={formData.fullName}
          onChange={onFormChange}
          required
          fullWidth
        />
        <TextField
          label="Correo electrónico"
          name="email"
          type="email"
          value={formData.email}
          onChange={onFormChange}
          required
          fullWidth
        />
        <TextField
          label="Dirección completa"
          name="address"
          value={formData.address}
          onChange={onFormChange}
          required
          fullWidth
        />
        <TextField
          label="Código postal"
          name="postalCode"
          value={formData.postalCode}
          onChange={onFormChange}
          required
          fullWidth
        />
        <TextField
          label="Población"
          name="city"
          value={formData.city}
          onChange={onFormChange}
          required
          fullWidth
        />
        <TextField
          label="Fecha de nacimiento"
          name="birthDate"
          type="date"
          value={formData.birthDate}
          onChange={onFormChange}
          required
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          label="DNI"
          name="dni"
          value={formData.dni}
          onChange={onFormChange}
          required
          fullWidth
        />
        <TextField
          label="Teléfono"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={onFormChange}
          required
          fullWidth
        />
        <FormControl fullWidth required>
          <InputLabel>Sexo</InputLabel>
          <Select
            name="sex"
            value={formData.sex}
            onChange={onFormChange}
            label="Sexo"
          >
            <MenuItem value={Sex.FEMALE}>{Sex.FEMALE}</MenuItem>
            <MenuItem value={Sex.MALE}>{Sex.MALE}</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth required>
          <InputLabel>Tipo de federativa</InputLabel>
          <Select
            name="licenseType"
            value={formData.licenseType}
            onChange={onFormChange}
            label="Tipo de federativa"
          >
            <MenuItem value={FederationType.FERM}>Federarme en FERM</MenuItem>
            <MenuItem value={FederationType.FMRM}>Federarme en FMRM</MenuItem>
            <MenuItem value={FederationType.FEDME}>Federarme en FEDME</MenuItem>
            <MenuItem value={FederationType.ALREADY_FEDERATED}>
              Ya estoy federado
            </MenuItem>
          </Select>
        </FormControl>

        <DataProtectionSection
          dataProtectionAccepted={dataProtectionAccepted}
          imageRightsAccepted={imageRightsAccepted}
          onDataProtectionChange={onDataProtectionChange}
          onImageRightsChange={onImageRightsChange}
        />

        <Box sx={{ display: "flex", gap: 2 }}>
          <Button variant="outlined" size="large" onClick={onBack} fullWidth>
            Volver
          </Button>
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={!dataProtectionAccepted}
            fullWidth
          >
            Siguiente
          </Button>
        </Box>
      </Box>
    </form>
  );
}

interface DataProtectionSectionProps {
  dataProtectionAccepted: boolean;
  imageRightsAccepted: boolean;
  onDataProtectionChange: (checked: boolean) => void;
  onImageRightsChange: (checked: boolean) => void;
}

const DataProtectionSection = memo(function DataProtectionSection({
  dataProtectionAccepted,
  imageRightsAccepted,
  onDataProtectionChange,
  onImageRightsChange,
}: DataProtectionSectionProps) {
  return (
    <Box sx={{ mt: 3, p: 3, bgcolor: "grey.50", borderRadius: 1 }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
        Protección de datos
      </Typography>

      <Typography
        variant="subtitle1"
        gutterBottom
        sx={{ fontWeight: "bold", mt: 2 }}
      >
        Protección de datos personales
      </Typography>
      <Typography variant="body2" paragraph>
        De conformidad con lo dispuesto en el Reglamento (UE) 2016/679 (RGPD) y
        en la Ley Orgánica 3/2018, se informa de que los datos personales
        facilitados en la presente ficha serán tratados por VERTIKAL, con
        domicilio en C/ Espronceda, 16 2-B, CP 30140, Santomera (Murcia), en su
        condición de responsable del tratamiento.
      </Typography>

      <Typography
        variant="subtitle2"
        gutterBottom
        sx={{ fontWeight: "bold", mt: 2 }}
      >
        Finalidad y base jurídica del tratamiento
      </Typography>
      <Typography variant="body2" paragraph>
        Los datos serán tratados con la finalidad de gestionar la inscripción
        del interesado y la organización y desarrollo de las actividades del
        club, siendo la base legal la ejecución de la relación asociativa (art.
        6.1.b RGPD).
      </Typography>

      <Typography
        variant="subtitle2"
        gutterBottom
        sx={{ fontWeight: "bold", mt: 2 }}
      >
        Cesión de datos
      </Typography>
      <Typography variant="body2" paragraph>
        Para la tramitación de licencias y seguros deportivos, los datos
        necesarios serán comunicados a la Federación de Montañismo de la Región
        de Murcia y/o a la Federación de Espeleología de la Región de Murcia,
        así como a sus respectivas entidades aseguradoras. Dicha cesión resulta
        necesaria para la participación en las actividades federadas.
      </Typography>

      <Typography
        variant="subtitle2"
        gutterBottom
        sx={{ fontWeight: "bold", mt: 2 }}
      >
        Tratamiento de imágenes (consentimiento)
      </Typography>
      <Typography variant="body2" paragraph>
        Autorizo el uso de mi imagen obtenida durante las actividades del club
        para su publicación en la página web, redes sociales y otros medios de
        difusión propios del club, siempre con fines informativos y sin
        finalidad comercial.
      </Typography>

      <Typography
        variant="subtitle2"
        gutterBottom
        sx={{ fontWeight: "bold", mt: 2 }}
      >
        Derechos del interesado
      </Typography>
      <Typography variant="body2" paragraph>
        El interesado podrá ejercer los derechos de acceso, rectificación,
        supresión, oposición, limitación del tratamiento y portabilidad, así
        como retirar el consentimiento en cualquier momento, mediante solicitud
        escrita dirigida a VERTIKAL en la dirección indicada o al correo
        electrónico gestion@clubvertikal.es
      </Typography>

      <Box sx={{ mt: 3 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={dataProtectionAccepted}
              onChange={(e) => onDataProtectionChange(e.target.checked)}
              required
            />
          }
          label={
            <Typography variant="body2">
              He leído y acepto la política de protección de datos
            </Typography>
          }
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={imageRightsAccepted}
              onChange={(e) => onImageRightsChange(e.target.checked)}
            />
          }
          label={
            <Typography variant="body2">
              Autorizo el uso de mi imagen según lo indicado
            </Typography>
          }
        />
      </Box>
    </Box>
  );
});

const Step1PersonalData = memo(Step1PersonalDataComponent);

export default Step1PersonalData;
