import { Box, Typography } from "@mui/material";

function Footer() {
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
      <Typography variant="body2" color="white">
        Club Vertikal 2026
      </Typography>
    </Box>
  );
}

export default Footer;
