// src/components/Dashboard/FiltersBar.tsx
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material/Select";
import type { FC } from "react";

export type DashboardFilters = {
  proyecto: string;
  placa: string;
  conductor: string;
  estado: string;
  q: string;
  from?: string;
  to?: string;
};

type FiltersBarProps = {
  filters: DashboardFilters;
  onChange: (patch: Partial<DashboardFilters>) => void;
  proyectos?: string[];
  placas?: string[];
  conductores?: string[];
  estados?: string[];
};

const FiltersBar: FC<FiltersBarProps> = ({
  filters,
  onChange,
  proyectos = [],
  placas = [],
  conductores = [],
  estados = [],
}) => {
  const handleSelect =
    (key: keyof DashboardFilters) => (e: SelectChangeEvent<string>) =>
      onChange({ [key]: e.target.value });

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
        alignItems: "center",
        mb: 2,
      }}
    >
      {/* Proyecto */}
      <FormControl size="small" sx={{ minWidth: 180 }}>
        <InputLabel id="filtro-proyecto-label">Proyecto</InputLabel>
        <Select
          labelId="filtro-proyecto-label"
          id="filtro-proyecto"
          value={filters.proyecto}
          label="Proyecto"
          onChange={handleSelect("proyecto")}
        >
          <MenuItem value="">
            <em>Todos</em>
          </MenuItem>
          {proyectos.map((p) => (
            <MenuItem key={p} value={p}>
              {p}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Placa */}
      <FormControl size="small" sx={{ minWidth: 140 }}>
        <InputLabel id="filtro-placa-label">Placa</InputLabel>
        <Select
          labelId="filtro-placa-label"
          id="filtro-placa"
          value={filters.placa}
          label="Placa"
          onChange={handleSelect("placa")}
        >
          <MenuItem value="">
            <em>Todas</em>
          </MenuItem>
          {placas.map((p) => (
            <MenuItem key={p} value={p}>
              {p}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Conductor */}
      <FormControl size="small" sx={{ minWidth: 200 }}>
        <InputLabel id="filtro-conductor-label">Conductor</InputLabel>
        <Select
          labelId="filtro-conductor-label"
          id="filtro-conductor"
          value={filters.conductor}
          label="Conductor"
          onChange={handleSelect("conductor")}
        >
          <MenuItem value="">
            <em>Todos</em>
          </MenuItem>
          {conductores.map((c) => (
            <MenuItem key={c} value={c}>
              {c}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Estado */}
      <FormControl size="small" sx={{ minWidth: 160 }}>
        <InputLabel id="filtro-estado-label">Estado</InputLabel>
        <Select
          labelId="filtro-estado-label"
          id="filtro-estado"
          value={filters.estado}
          label="Estado"
          onChange={handleSelect("estado")}
        >
          <MenuItem value="">
            <em>Todos</em>
          </MenuItem>
          {estados.map((e) => (
            <MenuItem key={e} value={e}>
              {e}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Búsqueda libre */}
      <TextField
        size="small"
        label="Buscar"
        placeholder="Código, observación…"
        value={filters.q}
        onChange={(e) => onChange({ q: e.target.value })}
        sx={{ minWidth: 240, flex: 1 }}
      />
    </Box>
  );
};

export default FiltersBar;
