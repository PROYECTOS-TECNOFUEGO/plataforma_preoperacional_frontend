// src/views/Principal.tsx
import { useMemo, useState, useEffect } from "react";
import type { FC } from "react";
import {
  Box,
  Card,
  Chip,
  Icon,
  InputAdornment,
  TextField,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  useTheme,
  useMediaQuery,
  IconButton,
  Button,
  Tooltip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import PageContainer from "../components/PageContainer";
import PageHeader from "../components/PageHeader";
import EmptyState from "../components/EmptyState";
import axios from "axios";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import PrintIcon from "@mui/icons-material/Print";
import LoadingBackdrop from "../components/LoadingBackdrop";
import { useSnackbar } from "../components/SnackbarProvider";

type EstadoGeneral = "En proceso" | "Finalizado" | string;
type EstadoParcial =
  | "En curso"
  | "Pendiente"
  | "Terminado"
  | "No aplica"
  | string;

interface PrincipalItem {
  id: string;
  codigo: string;
  placa: string;
  conductor: string;
  fecha: string;
  // Estados
  estadoGeneral?: EstadoGeneral;
  estadoPrincipal?: EstadoParcial;
  estadoRelevo?: EstadoParcial;
  tieneRelevo?: boolean;
  // (opcional) si tu backend ya devuelve grupoId
  grupoId?: string;
}

type EstadoFiltro = "todos" | "en_proceso" | "pendiente_relevo" | "finalizado";

const Principal: FC = () => {
  const [search, setSearch] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState<EstadoFiltro>("todos");
  const [dataSource, setDataSource] = useState<PrincipalItem[]>([]);
  const [loading, setLoading] = useState(false);

  const { enqueue } = useSnackbar();
  const base = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Traducción de estados a texto visible
  const getEstadoDetalle = (r: PrincipalItem) => {
    const eg = r.estadoGeneral ?? "En proceso";
    const ep = r.estadoPrincipal ?? "En curso";
    const er = r.estadoRelevo ?? (r.tieneRelevo ? "Pendiente" : "No aplica");

    if (eg === "Finalizado") {
      return {
        chip: { label: "Finalizado", color: "success" as const },
        detalle: "Preoperacional finalizado",
      };
    }

    // En proceso
    if (!r.tieneRelevo) {
      if (ep === "En curso")
        return {
          chip: { label: "En proceso", color: "warning" as const },
          detalle: "Conductor en ruta",
        };
      if (ep === "Terminado")
        return {
          chip: { label: "En proceso", color: "warning" as const },
          detalle: "Conductor terminó (pendiente cierre)",
        };
      return {
        chip: { label: "En proceso", color: "warning" as const },
        detalle: "En curso",
      };
    }

    // Con relevo
    if (ep === "En curso" && er === "Pendiente") {
      return {
        chip: { label: "En proceso", color: "warning" as const },
        detalle: "Principal en ruta",
      };
    }
    if (ep === "Terminado" && er === "Pendiente") {
      return {
        chip: { label: "En proceso", color: "warning" as const },
        detalle: "Primer conductor terminado (pendiente relevo)",
      };
    }
    if (er === "En curso") {
      return {
        chip: { label: "En proceso", color: "warning" as const },
        detalle: "Relevo en ruta",
      };
    }

    return {
      chip: { label: eg, color: "default" as const },
      detalle: `${ep} / ${er}`,
    };
  };

  // Helpers para filtros
  const isFinalizado = (r: PrincipalItem) =>
    (r.estadoGeneral ?? "") === "Finalizado";
  const isPendienteRelevo = (r: PrincipalItem) =>
    (r.estadoGeneral ?? "En proceso") !== "Finalizado" &&
    !!r.tieneRelevo &&
    (r.estadoPrincipal ?? "") === "Terminado" &&
    (r.estadoRelevo ?? "") === "Pendiente";
  const isEnProceso = (r: PrincipalItem) => !isFinalizado(r);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${base}/formularios`)
      .then((res) => {
        const arr = Array.isArray(res.data) ? res.data : [];
        const registros: PrincipalItem[] = arr.map((item: any) => ({
          id:
            item.id ||
            item._id ||
            item.codigo ||
            `${Date.now()}_${Math.random().toString(36).slice(2)}`,
          codigo: item.codigo || "Sin código",
          placa: item.placa || "Desconocida",
          conductor: item.conductor || "Sin nombre",
          fecha: item.fecha || new Date().toISOString().split("T")[0],
          estadoGeneral: item.estadoGeneral,
          estadoPrincipal: item.estadoPrincipal,
          estadoRelevo: item.estadoRelevo,
          tieneRelevo: !!item.tieneRelevo,
          grupoId: item.grupoId,
        }));
        setDataSource(registros);
      })
      .catch(() => enqueue("Error al cargar formularios", "error"))
      .finally(() => setLoading(false));
  }, []);

  // Finalizar (decide actor y actualiza optimista)
  const handleFinalizarDesdeTabla = async (row: PrincipalItem) => {
    // actor: si no hay relevo -> principal
    // con relevo -> si principal no terminó, finaliza principal; si ya terminó, finaliza relevo
    const actor = !row.tieneRelevo
      ? "principal"
      : row.estadoPrincipal === "Terminado"
      ? "relevo"
      : "principal";

    try {
      setLoading(true);
      await axios.put(`${base}/formularios/${row.id}/finalizar?actor=${actor}`);

      // Optimista
      setDataSource((prev) =>
        prev.map((r) => {
          if (r.id !== row.id) return r;
          if (actor === "principal") {
            return {
              ...r,
              estadoPrincipal: "Terminado",
              estadoRelevo: r.tieneRelevo
                ? r.estadoRelevo || "Pendiente"
                : "No aplica",
              estadoGeneral: r.tieneRelevo ? "En proceso" : "Finalizado",
            };
          }
          // actor === 'relevo'
          return {
            ...r,
            estadoPrincipal: r.estadoPrincipal || "Terminado",
            estadoRelevo: "Terminado",
            estadoGeneral: "Finalizado",
          };
        })
      );

      if (row.tieneRelevo && row.estadoPrincipal !== "Terminado") {
        enqueue("Primer conductor finalizó. Pendiente relevo.", "info");
      } else {
        enqueue("Preoperacional finalizado.", "success");
      }
    } catch {
      enqueue("No se pudo finalizar el registro", "error");
    } finally {
      setLoading(false);
    }
  };

  // Contadores por estado (para chips)
  const counts = useMemo(() => {
    const total = dataSource.length;
    const finalizado = dataSource.filter(isFinalizado).length;
    const pendiente = dataSource.filter(isPendienteRelevo).length;
    const enProceso = total - finalizado;
    return { total, finalizado, pendiente, enProceso };
  }, [dataSource]);

  // Filtro combinado (texto + estado)
  const filteredData = useMemo(() => {
    const term = search.toLowerCase();

    const byText = dataSource.filter(
      (item) =>
        item.codigo.toLowerCase().includes(term) ||
        item.placa.toLowerCase().includes(term) ||
        item.conductor.toLowerCase().includes(term)
    );

    switch (estadoFiltro) {
      case "finalizado":
        return byText.filter(isFinalizado);
      case "pendiente_relevo":
        return byText.filter(isPendienteRelevo);
      case "en_proceso":
        return byText.filter(isEnProceso);
      default:
        return byText;
    }
  }, [search, dataSource, estadoFiltro]);

  return (
    <PageContainer>
      <PageHeader
        title="Registros"
        actions={
          <>
            <TextField
              placeholder="Buscar..."
              size="small"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Icon>search</Icon>
                    </InputAdornment>
                  ),
                  "aria-label": "Buscar registros",
                },
              }}
              sx={{ width: { xs: "100%", sm: 260 } }}
            />
            <Button onClick={() => navigate("/formulario")}>Nuevo</Button>
          </>
        }
      />

      {/* Filtros de estado */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
        <Chip
          label={`Todos (${counts.total})`}
          onClick={() => setEstadoFiltro("todos")}
          variant={estadoFiltro === "todos" ? "filled" : "outlined"}
        />
        <Chip
          color="warning"
          label={`En proceso (${counts.enProceso})`}
          onClick={() => setEstadoFiltro("en_proceso")}
          variant={estadoFiltro === "en_proceso" ? "filled" : "outlined"}
        />
        <Chip
          color="info"
          label={`Pendiente relevo (${counts.pendiente})`}
          onClick={() => setEstadoFiltro("pendiente_relevo")}
          variant={estadoFiltro === "pendiente_relevo" ? "filled" : "outlined"}
        />
        <Chip
          color="success"
          label={`Finalizado (${counts.finalizado})`}
          onClick={() => setEstadoFiltro("finalizado")}
          variant={estadoFiltro === "finalizado" ? "filled" : "outlined"}
        />
      </Box>

      <Card sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2 }}>
        <TableContainer component={Paper} elevation={0}>
          <Table size="small" aria-label="Tabla de registros">
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>Código</strong>
                </TableCell>
                {!isMobile && (
                  <TableCell>
                    <strong>Placa</strong>
                  </TableCell>
                )}
                {!isMobile && (
                  <TableCell>
                    <strong>Conductor</strong>
                  </TableCell>
                )}
                <TableCell>
                  <strong>Fecha</strong>
                </TableCell>
                <TableCell>
                  <strong>Estado</strong>
                </TableCell>
                <TableCell>
                  <strong>Acciones</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.map((row) => {
                const estado = getEstadoDetalle(row);
                const puedeFinalizar = row.estadoGeneral !== "Finalizado";
                return (
                  <TableRow key={row.id} hover>
                    <TableCell>{row.codigo}</TableCell>
                    {!isMobile && <TableCell>{row.placa}</TableCell>}
                    {!isMobile && <TableCell>{row.conductor}</TableCell>}
                    <TableCell>{row.fecha}</TableCell>
                    <TableCell>
                      <Box
                        display="flex"
                        alignItems="center"
                        gap={1}
                        flexWrap="wrap"
                      >
                        <Chip
                          label={estado.chip.label}
                          color={estado.chip.color}
                          size="small"
                          sx={{ height: 22 }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {estado.detalle}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box
                        display="flex"
                        gap={0.5}
                        flexWrap="wrap"
                        justifyContent={isMobile ? "center" : "flex-start"}
                      >
                        <Tooltip title="Ver">
                          <IconButton
                            aria-label="Ver detalle"
                            onClick={() => navigate(`/ver/${row.id}`)}
                            sx={{
                              color: theme.palette.primary.main,
                              "&:hover": {
                                backgroundColor: theme.palette.primary.main,
                                color: "#fff",
                              },
                            }}
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Editar">
                          <IconButton
                            aria-label="Editar registro"
                            onClick={() => navigate(`/editar/${row.id}`)}
                            sx={{
                              color: theme.palette.primary.main,
                              "&:hover": {
                                backgroundColor: theme.palette.primary.main,
                                color: "#fff",
                              },
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Imprimir">
                          <IconButton
                            aria-label="Imprimir registro"
                            sx={{
                              color: theme.palette.primary.main,
                              "&:hover": {
                                backgroundColor: theme.palette.primary.main,
                                color: "#fff",
                              },
                            }}
                          >
                            <PrintIcon />
                          </IconButton>
                        </Tooltip>

                        {puedeFinalizar && (
                          <Tooltip title="Finalizar">
                            <IconButton
                              aria-label="Finalizar registro"
                              onClick={() => handleFinalizarDesdeTabla(row)}
                              sx={{
                                color: theme.palette.primary.main,
                                "&:hover": {
                                  backgroundColor: theme.palette.primary.main,
                                  color: "#fff",
                                },
                              }}
                            >
                              <Icon>flag</Icon>
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}

              {filteredData.length === 0 && (
                <TableRow>
                  <TableCell colSpan={isMobile ? 4 : 6}>
                    <EmptyState text="No se encontraron registros." />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <LoadingBackdrop open={loading} />
    </PageContainer>
  );
};

export default Principal;
