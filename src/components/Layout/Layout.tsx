// src/components/Layout/Layout.tsx

import { Box, CssBaseline } from "@mui/material";
import { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import { Outlet } from "react-router-dom"; // Para renderizar la página hija activa

const Layout = () => {
  // Estado para controlar si el Sidebar está expandido o colapsado
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Función que alterna el estado del Sidebar
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  // Ancho dinámico del Sidebar
  const drawerWidth = sidebarOpen ? 200 : 60;

  return (
    // Contenedor principal con layout vertical y altura mínima de la pantalla completa
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* CssBaseline para estandarizar los estilos base de Material UI */}
      <CssBaseline />

      {/* Header fijo en la parte superior */}
      <Header toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />

      {/* Contenedor principal dividido horizontalmente entre Sidebar y contenido */}
      <Box sx={{ display: "flex", flex: 1, pt: "64px" }}>
        {/* Menú lateral (Sidebar) */}
        <Sidebar open={sidebarOpen} />

        {/* Contenedor del contenido principal */}
        <Box
          component="main"
          sx={{
            flexGrow: 1, // Toma todo el espacio disponible a la derecha del Sidebar
            ml: `${drawerWidth}px`, // Margen izquierdo igual al ancho del Sidebar
            px: 2, // Padding horizontal
            pt: 2, // Padding top (bajo el header)
            display: "flex",
            flexDirection: "column",
            minHeight: "calc(100vh - 64px)", // Altura disponible sin el header
            overflowY: "auto", // Scroll vertical si el contenido excede la pantalla
            overflowX: "hidden", // Evita scroll horizontal
            transition: "margin 0.3s", // Transición suave del margen al abrir/cerrar Sidebar
          }}
        >
          {/* Contenido dinámico según la ruta activa */}
          <Box sx={{ flexGrow: 1 }}>
            <Outlet />
          </Box>

          {/* Pie de página (Footer) */}
          <Footer />
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
