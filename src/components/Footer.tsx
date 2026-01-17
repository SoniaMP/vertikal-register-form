import { Box, Container, Stack, Typography } from "@mui/material";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        py: 2,
        bgcolor: "grey.800",
        textAlign: "center",
        zIndex: 1100,
      }}
    >
      <Container maxWidth="lg">
        <Stack
          direction="row"
          justifyContent="center"
          spacing={2}
          mb={1}
          alignItems="center"
        >
          <Typography variant="body2" color="white">
            © 2026 Club VERTIKAL
          </Typography>
          <Typography variant="body2" color="white">
            ·
          </Typography>
          <Typography variant="body2" color="white">
            Todos los derechos reservados
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
};

export default Footer;
