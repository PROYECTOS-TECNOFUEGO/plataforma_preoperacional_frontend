// src/views/NoAutorizado.tsx

import { Typography, Box } from "@mui/material";
import PageContainer from "../components/PageContainer";

//Página que se muestra cuando un usuario intenta acceder a una ruta protegida para la cual no tiene permisos (según su rol).

const NoAutorizado = () => {
  return (
    <PageContainer>
      <Box textAlign="center" mt={10}>
        <Typography variant="h4" color="error" gutterBottom>
          🚫 Acceso no autorizado
        </Typography>

        <Typography variant="subtitle1">
          No tienes permiso para acceder a esta sección.
        </Typography>
      </Box>
    </PageContainer>
  );
};

export default NoAutorizado;
