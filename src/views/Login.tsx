/* IMAGEN DE FONDO ACOMODAR OPACIDAD,
QUITAR LOGO DE LA CARD DE LOGIN,
COLOCAR BACKLOGIN RESPONSIVE,
AUTOAJUSTADO. */
// src/views/Login.tsx
import React, { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  Checkbox,
  Collapse,
  FormControlLabel,
  Icon,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
// import LogoTecno from "../assets/LogoTecno.png";
import Backlogin from "../assets/Backlogin.png";

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(username, password);

    if (success) {
      navigate("/principal");
    } else {
      setError("Usuario o contraseña incorrectos");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        // backgroundImage: `url(${Backlogin})`,
        // backgroundSize: "cover",
        // backgroundPosition: "center",
        // backgroundRepeat: "no-repeat",
        position: "relative",
        overflow: "hidden",
        px: 2,
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage: `url(${Backlogin})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          filter: "brightness(0.8)",
          zIndex: -1,
        }}
      />
      {/* <Card
        elevation={6}
        sx={{
          width: isMobile ? "100%" : 400,
          maxWidth: 420,
          p: { xs: 3, sm: 4 },
          borderRadius: 4,
          textAlign: "center",
        }}
      >
        {/* Logo
        <Box
          component="img"
          src={LogoTecno}
          alt="TecnoFuego"
          sx={{ height: 64, mb: 2, mx: "auto" }}
        /> */}

      {/*Card login */}
      <Card
        elevation={6}
        sx={{
          width: isMobile ? "100%" : 360,
          maxWidth: 380,
          p: { xs: 3, sm: 4 },
          borderRadius: 4,
          textAlign: "center",
        }}
      >
        <Typography variant="h5" fontWeight={600} mb={2}>
          Iniciar sesión
        </Typography>

        {/* Alerta de error */}
        <Collapse in={!!error} sx={{ mb: 2 }}>
          <Alert severity="error" onClose={() => setError("")}>
            {error}
          </Alert>
        </Collapse>

        <Box component="form" onSubmit={handleSubmit}>
          {/* Usuario */}
          <TextField
            fullWidth
            label="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            margin="normal"
            required
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Icon>person</Icon>
                  </InputAdornment>
                ),
              },
            }}
          />

          {/* Contraseña */}
          <TextField
            fullWidth
            label="Contraseña"
            type={showPwd ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Icon>lock</Icon>
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                      onClick={() => setShowPwd((prev) => !prev)}
                    >
                      <Icon>{showPwd ? "visibility_off" : "visibility"}</Icon>
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          {/* Recordarme */}
          <FormControlLabel
            control={<Checkbox color="primary" />}
            label="Recuérdame"
            sx={{ mt: 1, mb: 2, display: "flex", justifyContent: "flex-start" }}
          />

          {/* Botón */}
          <Button
            fullWidth
            variant="contained"
            size="large"
            type="submit"
            sx={{ py: 1 }}
          >
            Entrar
          </Button>
        </Box>

        {/* Enlace olvidó contraseña (placeholder) */}
        <Typography
          variant="body2"
          sx={{
            mt: 2,
            cursor: "pointer",
            "&:hover": { textDecoration: "underline" },
          }}
          onClick={() => alert("Funcionalidad pendiente")}
        >
          ¿Olvidaste tu contraseña?
        </Typography>
      </Card>
    </Box>
  );
};

export default Login;
