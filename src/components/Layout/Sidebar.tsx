// src/components/Layout/Sidebar.tsx
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Icon,
  Tooltip,
  Collapse,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

interface SidebarProps {
  open: boolean;
}

const SIDEBAR_WIDTH_OPEN = 200;
const SIDEBAR_WIDTH_CLOSED = 60;
const HEADER_HEIGHT = 64;

const Sidebar = ({ open }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { usuario } = useAuth();
  const [preoperacionalOpen, setPreoperacionalOpen] = useState(true);

  const handleNavigation = (path?: string) => {
    if (path) navigate(path);
  };

  const items = [
    {
      text: "Dashboard",
      icon: "dashboard",
      path: "/dashboard",
      roles: ["admin"],
    },
    {
      text: "Principal",
      icon: "layers",
      path: "/principal",
      roles: ["admin"],
    },
    {
      text: "Reportes",
      icon: "bar_chart",
      path: "/reportes",
      roles: ["admin", "supervisor"],
    },
    {
      text: "Usuarios",
      icon: "people",
      path: "/usuarios",
      roles: ["admin", "supervisor"],
    },
    {
      text: "Vehículos",
      icon: "commute",
      path: "/vehiculos",
      roles: ["admin", "supervisor"],
    },
  ];

  return (
    <Box
      role="navigation"
      aria-label="Menú lateral"
      sx={{
        width: open ? SIDEBAR_WIDTH_OPEN : SIDEBAR_WIDTH_CLOSED,
        backgroundImage:
          "linear-gradient(to bottom, rgba(116, 116, 116, 1), rgba(255, 255, 255, 1))",
        height: `calc(100vh - ${HEADER_HEIGHT}px)`,
        position: "fixed",
        top: HEADER_HEIGHT,
        left: 0,
        transition: "width 0.3s",
        boxShadow: 2,
        zIndex: 1200,
        overflowX: "hidden",
        overflowY: "auto",
      }}
    >
      <List sx={{ py: 1 }}>
        {/* Sección padre */}
        <ListItem
          disablePadding
          sx={{ justifyContent: open ? "flex-start" : "center" }}
        >
          <Tooltip title={!open ? "Preoperacional" : ""} placement="right">
            <ListItemButton
              onClick={() => setPreoperacionalOpen(!preoperacionalOpen)}
              aria-expanded={preoperacionalOpen}
              sx={{
                justifyContent: open ? "flex-start" : "center",
                px: open ? 2 : 1,
                py: 1.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 2 : "auto",
                  justifyContent: "center",
                }}
              >
                <Icon sx={{ color: "white" }}>description</Icon>
              </ListItemIcon>
              {open && (
                <ListItemText
                  primary="Preoperacional"
                  slotProps={{
                    primary: {
                      sx: { color: "white", fontWeight: 700 },
                    },
                  }}
                />
              )}
            </ListItemButton>
          </Tooltip>
        </ListItem>

        {/* Submenús */}
        <Collapse in={preoperacionalOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding sx={{ pb: 1 }}>
            {items
              // Si NO hay usuario, muestra todo. Si hay, filtra por rol.
              .filter((item) => !usuario || item.roles.includes(usuario.rol))
              .map((item) => {
                const selected = location.pathname === item.path;
                return (
                  <ListItem
                    key={item.text}
                    disablePadding
                    sx={{ justifyContent: open ? "flex-start" : "center" }}
                  >
                    <Tooltip title={!open ? item.text : ""} placement="right">
                      <ListItemButton
                        onClick={() => handleNavigation(item.path)}
                        selected={selected}
                        sx={(theme) => ({
                          position: "relative",
                          justifyContent: open ? "flex-start" : "center",
                          px: open ? 4 : 1,
                          py: 1,
                          borderRadius: 1.5,
                          "&:hover": {
                            backgroundColor: alpha(
                              theme.palette.primary.main,
                              0.08
                            ),
                          },
                          "&.Mui-selected": {
                            backgroundColor: alpha(
                              theme.palette.primary.main,
                              0.12
                            ),
                          },
                          "&.Mui-selected:hover": {
                            backgroundColor: alpha(
                              theme.palette.primary.main,
                              0.18
                            ),
                          },
                          // Indicador de seleccionado (borde izquierdo)
                          ...(selected && open
                            ? {
                                "&::before": {
                                  content: '""',
                                  position: "absolute",
                                  left: 8,
                                  top: 6,
                                  bottom: 6,
                                  width: 3,
                                  borderRadius: 2,
                                  backgroundColor: theme.palette.primary.main,
                                },
                              }
                            : {}),
                        })}
                      >
                        <ListItemIcon
                          sx={{
                            minWidth: 0,
                            mr: open ? 2 : "auto",
                            justifyContent: "center",
                            color: selected ? "primary.main" : "inherit",
                          }}
                        >
                          <Icon>{item.icon}</Icon>
                        </ListItemIcon>

                        {open && (
                          <ListItemText
                            primary={item.text}
                            slotProps={{
                              primary: {
                                sx: {
                                  fontWeight: 600,
                                  color: selected
                                    ? "primary.main"
                                    : "text.primary",
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                },
                              },
                            }}
                          />
                        )}
                      </ListItemButton>
                    </Tooltip>
                  </ListItem>
                );
              })}
          </List>
        </Collapse>
      </List>
    </Box>
  );
};

export default Sidebar;
