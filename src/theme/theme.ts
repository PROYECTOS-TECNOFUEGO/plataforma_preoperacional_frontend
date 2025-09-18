// src/theme/theme.ts
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#FF4D2E" },
    secondary: { main: "#d4d9de" },
    background: { default: "#f5f7fa", paper: "#ffffff" },
    text: { primary: "#1c1c1c", secondary: "#5f5f5f" },
  },
  shape: { borderRadius: 12 },
  spacing: 8,
  typography: {
    fontFamily:
      'Roboto, system-ui, -apple-system, "Segoe UI", Arial, sans-serif',
    h5: { fontWeight: 700, letterSpacing: 0.2 },
    h6: { fontWeight: 700 },
    subtitle2: { fontWeight: 600 },
    button: { textTransform: "none", fontWeight: 600, letterSpacing: 0.2 },
  },
  components: {
    MuiButton: {
      defaultProps: { variant: "contained", disableElevation: true },
      styleOverrides: {
        root: { borderRadius: 12 },
        containedPrimary: { boxShadow: "0 6px 16px rgba(255,77,46,.24)" },
      },
    },
    MuiCard: {
      defaultProps: { elevation: 3 },
      styleOverrides: {
        root: { borderRadius: 16, border: "1px solid #eef0f2" },
      },
    },
    MuiTextField: {
      defaultProps: { size: "small", fullWidth: true },
    },
    MuiIconButton: {
      defaultProps: { size: "small" },
    },
    MuiTableCell: {
      styleOverrides: { head: { fontWeight: 700 } },
    },
    MuiTooltip: {
      defaultProps: { arrow: true },
    },
  },
});

export default theme;
