// src/views/Vehiculos.tsx
import { useMemo, useState, useEffect } from "react";
import type { FC } from "react";
import {
  Box,
  Card,
  Divider,
  Icon,
  Typography,
  TextField,
  InputAdornment,
  Chip,
  useTheme,
  useMediaQuery,
  Select,
  MenuItem,
} from "@mui/material";
import axios from "axios";
import PageContainer from "../components/PageContainer";
import PageHeader from "../components/PageHeader";
import EmptyState from "../components/EmptyState";
import LoadingBackdrop from "../components/LoadingBackdrop";
import { useSnackbar } from "../components/SnackbarProvider";
import type { SelectChangeEvent } from "@mui/material/Select";

type EstadoVehiculo = "Activo" | "Mantenimiento" | "Inactivo";

interface Vehicle {
  id?: string | number;
  placa: string;
  tipo: string;
  modelo: string;
  estado: EstadoVehiculo;
}

const estados: EstadoVehiculo[] = ["Activo", "Mantenimiento", "Inactivo"];

const Vehiculos: FC = () => {
  const [busqueda, setBusqueda] = useState("");
  const [vehiculos, setVehiculos] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(false);

  const { enqueue } = useSnackbar();
  // Igual que en las otras páginas: ya incluye /api
  const api = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${api}/vehiculos`)
      .then((res) => {
        const lista: Vehicle[] = (Array.isArray(res.data) ? res.data : []).map(
          (v: any) => ({
            id: v.id ?? undefined,
            placa: v.placa,
            tipo: v.tipo,
            modelo: v.modelo,
            estado: (v.estado as EstadoVehiculo) ?? "Activo",
          })
        );
        setVehiculos(lista);
      })
      .catch(() => enqueue("Error al cargar vehículos", "error"))
      .finally(() => setLoading(false));
  }, []);

  const vehiculosFiltrados = useMemo(
    () =>
      vehiculos.filter((v) =>
        v.placa.toLowerCase().includes(busqueda.toLowerCase())
      ),
    [busqueda, vehiculos]
  );

  const chipColor = (estado: EstadoVehiculo) => {
    switch (estado) {
      case "Activo":
        return "success" as const;
      case "Mantenimiento":
        return "warning" as const;
      case "Inactivo":
        return "error" as const;
      default:
        return "default" as const;
    }
  };

  const handleEstadoChange = async (
    vehiculo: Vehicle,
    e: SelectChangeEvent<string>
  ) => {
    const next = e.target.value as EstadoVehiculo;

    const prevSnapshot = vehiculos.map((v) => ({ ...v }));

    // Optimistic UI
    setVehiculos((list) =>
      list.map((v) => (v.placa === vehiculo.placa ? { ...v, estado: next } : v))
    );

    try {
      const key = vehiculo.id ?? vehiculo.placa; // usa id si existe; si no, placa
      await axios.patch(`${api}/vehiculos/${encodeURIComponent(String(key))}`, {
        estado: next,
      });
      enqueue("Estado actualizado", "success");
    } catch {
      // rollback
      setVehiculos(prevSnapshot);
      enqueue("No se pudo actualizar el estado", "error");
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Vehículos"
        actions={
          <TextField
            placeholder="Buscar por placa"
            size="small"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Icon>search</Icon>
                  </InputAdornment>
                ),
                "aria-label": "Buscar por placa",
              },
            }}
            sx={{ width: { xs: "100%", sm: 280 } }}
          />
        }
      />

      <Card sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2 }}>
        <Box
          sx={{
            border: "1px solid #eee",
            borderRadius: 2,
            maxHeight: "50vh",
            overflowY: "auto",
            px: 2,
            py: 1,
          }}
        >
          {vehiculosFiltrados.length === 0 ? (
            <EmptyState text="No se encontraron vehículos." />
          ) : (
            vehiculosFiltrados.map((vehiculo, idx) => (
              <Box key={vehiculo.id ?? vehiculo.placa}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems={isMobile ? "flex-start" : "center"}
                  py={1.5}
                  flexDirection={isMobile ? "column" : "row"}
                  gap={1.5}
                  sx={{
                    "&:hover": {
                      backgroundColor: "#f5f5f5",
                      transition: "background 0.2s",
                    },
                  }}
                >
                  <Box display="flex" alignItems="center" gap={1}>
                    <Icon sx={{ color: "#555" }}>directions_car</Icon>
                    <Box>
                      <Typography variant="subtitle1" fontWeight={500}>
                        {vehiculo.placa}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {vehiculo.tipo} · {vehiculo.modelo}
                      </Typography>
                    </Box>
                  </Box>

                  <Box
                    display="flex"
                    alignItems="center"
                    gap={1}
                    flexWrap="wrap"
                  >
                    <Chip
                      label={vehiculo.estado}
                      color={chipColor(vehiculo.estado)}
                      size="small"
                      sx={{ fontWeight: 700 }}
                    />
                    <Select
                      size="small"
                      value={vehiculo.estado}
                      onChange={(e) => handleEstadoChange(vehiculo, e)}
                      sx={{ minWidth: 160 }}
                    >
                      {estados.map((s) => (
                        <MenuItem key={s} value={s}>
                          {s}
                        </MenuItem>
                      ))}
                    </Select>
                  </Box>
                </Box>

                {idx !== vehiculosFiltrados.length - 1 && (
                  <Divider sx={{ ml: 5 }} />
                )}
              </Box>
            ))
          )}
        </Box>
      </Card>

      <LoadingBackdrop open={loading} />
    </PageContainer>
  );
};

export default Vehiculos;
