// src/components/Layout/Header.tsx
import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Icon,
  Box,
  Menu,
  MenuItem,
} from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import LogoTecno from "../../assets/LogoTecno.png";

interface HeaderProps {
  toggleSidebar: () => void;
  sidebarOpen: boolean;
}

const HEADER_HEIGHT = 64;

const Header = ({ toggleSidebar, sidebarOpen }: HeaderProps) => {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate("/login");
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        height: HEADER_HEIGHT,
        // Gradiente
        backgroundImage: "linear-gradient(to right, #ff3131, #ff914d)",
      }}
    >
      <Toolbar
        sx={{
          minHeight: HEADER_HEIGHT,
          px: 2,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 1,
        }}
      >
        {/* Botón menú + Logo + Título */}
        <Box
          display="flex"
          alignItems="center"
          minWidth={0}
          sx={{ flexShrink: 1, overflow: "hidden" }}
        >
          <IconButton
            color="inherit"
            onClick={toggleSidebar}
            sx={{ mr: 1 }}
            aria-label={
              sidebarOpen ? "Cerrar panel lateral" : "Abrir panel lateral"
            }
          >
            <Icon>{sidebarOpen ? "chevron_left" : "menu"}</Icon>
          </IconButton>

          <Box
            component="img"
            src={LogoTecno}
            alt="Logo TecnoFuego"
            onClick={() => navigate("/dashboard")}
            sx={{
              height: 40,
              mr: 2,
              flexShrink: 0,
              cursor: "pointer",
              userSelect: "none",
            }}
          />

          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: { xs: 180, sm: 300 },
              fontSize: { xs: "1rem", sm: "1.25rem" },
            }}
            title="Plataforma Preoperacional"
          >
            Plataforma Preoperacional
          </Typography>
        </Box>

        {/* Usuario + Menú */}
        <Box
          display="flex"
          alignItems="center"
          gap={1}
          sx={{ mt: { xs: 1, sm: 0 } }}
        >
          <Typography
            variant="body1"
            noWrap
            sx={{ fontSize: { xs: "0.85rem", sm: "1rem" } }}
            title={
              usuario ? `${usuario.username} (${usuario.rol})` : "Invitado"
            }
          >
            {usuario ? `${usuario.username} (${usuario.rol})` : "Invitado"}
          </Typography>

          <IconButton
            color="inherit"
            onClick={handleMenuOpen}
            aria-label="Abrir menú de usuario"
            aria-controls={open ? "user-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <Icon>account_circle</Icon>
          </IconButton>

          <Menu
            id="user-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            MenuListProps={{ "aria-labelledby": "user-menu" }}
          >
            <MenuItem onClick={handleMenuClose}>Mi perfil</MenuItem>
            <MenuItem onClick={handleLogout}>Cerrar sesión</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
