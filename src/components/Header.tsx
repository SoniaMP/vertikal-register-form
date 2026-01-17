import { AppBar, Toolbar, Typography, Box, Container } from "@mui/material";

function Header() {
  return (
    <AppBar position="fixed">
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
          <Box
            component="img"
            src="/logo-club.png"
            alt="Logo VERTIKAL"
            sx={{
              height: 50,
            }}
          />
          <Typography variant="h6" component="h1" sx={{ fontWeight: "bold" }}>
            Solicitud inscripción VERTIKAL 2026
          </Typography>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Header;
