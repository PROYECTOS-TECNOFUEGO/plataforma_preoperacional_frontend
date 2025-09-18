// src/views/Reportes.tsx
import { useMemo, useState } from "react";
import type { FC } from "react";
import {
  Box,
  Card,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  TextField,
  InputAdornment,
  Icon,
} from "@mui/material";
import PageContainer from "../components/PageContainer";
import PageHeader from "../components/PageHeader";
import EmptyState from "../components/EmptyState";

interface Reporte {
  key: string;
  codigo: string;
  placa: string;
  conductor: string;
  fecha: string; // YYYY-MM-DD
  observaciones: string;
}

const Reportes: FC = () => {
  // Estado sin mock: arrancamos vacío
  const [reportes] = useState<Reporte[]>([]);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [busqueda, setBusqueda] = useState("");

  const dataFiltrada = useMemo(() => {
    const term = busqueda.toLowerCase();
    return reportes.filter((r) => {
      const fechaOk =
        (!fechaInicio || r.fecha >= fechaInicio) &&
        (!fechaFin || r.fecha <= fechaFin);

      const matchTexto =
        r.codigo.toLowerCase().includes(term) ||
        r.placa.toLowerCase().includes(term) ||
        r.conductor.toLowerCase().includes(term) ||
        r.observaciones.toLowerCase().includes(term);

      return fechaOk && matchTexto;
    });
  }, [fechaInicio, fechaFin, busqueda, reportes]);

  return (
    <PageContainer>
      <PageHeader
        title="Reportes"
        actions={
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(3, max-content)" },
              gap: 2,
              alignItems: "center",
              width: "100%",
            }}
          >
            <TextField
              type="date"
              label="Desde"
              size="small"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              type="date"
              label="Hasta"
              size="small"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              placeholder="Buscar por texto"
              size="small"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              sx={{ width: { xs: "100%", sm: 260 } }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Icon>search</Icon>
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Box>
        }
      />

      <Card sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2 }}>
        <TableContainer component={Paper} elevation={0}>
          {dataFiltrada.length === 0 ? (
            <EmptyState text="No se encontraron resultados." />
          ) : (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>Código</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Placa</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Conductor</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Fecha</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Observaciones</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dataFiltrada.map((r) => (
                  <TableRow key={r.key} hover>
                    <TableCell>{r.codigo}</TableCell>
                    <TableCell>{r.placa}</TableCell>
                    <TableCell>{r.conductor}</TableCell>
                    <TableCell>{r.fecha}</TableCell>
                    <TableCell>{r.observaciones}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TableContainer>
      </Card>
    </PageContainer>
  );
};

export default Reportes;
