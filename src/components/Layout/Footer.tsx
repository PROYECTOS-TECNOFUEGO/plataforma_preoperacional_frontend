// src/components/Layout/Footer.tsx
import { Box, Typography } from "@mui/material";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        width: "100%",
        py: 2,
        px: 2,
        textAlign: "center",
        bgcolor: "background.paper",
        color: "white",
        borderTop: "1px solid #e0e0e0",
        background: "linear-gradient(to right, #ff3131, #ff914d)",
        fontSize: "0.875rem",
        mt: "auto",
      }}
    >
      <Typography variant="body2">
        © {new Date().getFullYear()} Plataforma Preoperacional - TecnoFuego
      </Typography>
    </Box>
  );
};

export default Footer;
