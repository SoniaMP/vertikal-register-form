import { AppBar, Toolbar, Typography, Box, Container } from "@mui/material";
import vertikalLOGO from "../assets/vertikal-logo-blanco-horizontal.png";

function Header() {
  return (
    <AppBar position="fixed">
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
          <Box
            component="img"
            src={vertikalLOGO}
            alt="Logo VERTIKAL"
            sx={{
              height: 50,
              p: 0.5,
            }}
          />
          <Typography variant="h6">
            Solicitud inscripción VERTIKAL 2026
          </Typography>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Header;
