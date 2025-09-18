// src/views/Dashboard.tsx
import { useEffect, useMemo, useState } from "react";
import Grid from "@mui/material/Grid";
import PageContainer from "../components/PageContainer";
import KpiCard from "../components/Dashboard/KpiCard";
import FiltersBar from "../components/Dashboard/FiltersBar";
import type { DashboardFilters } from "../components/Dashboard/FiltersBar";
import LoadingBackdrop from "../components/LoadingBackdrop";
import { useSnackbar } from "../components/SnackbarProvider";
import axios from "axios";

import TimeSeries from "../components/Dashboard/TimeSeries";
import TopBars from "../components/Dashboard/TopBars";
import type { TimePoint } from "../components/Dashboard/TimeSeries";
import type { TopItem } from "../components/Dashboard/TopBars";

type Formulario = {
  id: string;
  codigo: string;
  placa: string;
  conductor: string;
  fecha: string; // YYYY-MM-DD
  documentos?: Record<string, string>;
  carroceria?: Record<string, string>;
  antesEncender?: Record<string, string>;
  botiquin?: Record<string, string>;
  vehiculoEncendido?: Record<string, string>;
  proyecto?: string;
};

type Vehiculo = {
  placa: string;
  estado?: "Activo" | "Mantenimiento" | "Inactivo" | string;
};

const toDate = (s?: string) => {
  if (!s) return new Date(NaN);
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
};

const inRange = (dateStr?: string, from?: string, to?: string) => {
  if (!dateStr || !from || !to) return false;
  const d = toDate(dateStr).getTime();
  const f = toDate(from).getTime();
  const t = toDate(to).getTime();
  if (Number.isNaN(d) || Number.isNaN(f) || Number.isNaN(t)) return false;
  return d >= f && d <= t;
};

const sumSection = (obj?: Record<string, string>) => {
  if (!obj) return { total: 0, cumple: 0, noCumple: 0 };
  const values = Object.values(obj);
  const total = values.length;
  const cumple = values.filter((v) => v === "cumple").length;
  const noCumple = values.filter((v) => v === "noCumple").length;
  return { total, cumple, noCumple };
};

const Dashboard = () => {
  const { enqueue } = useSnackbar();
  const base = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

  // Fecha "hoy" (YYYY-MM-DD)
  const today = useMemo(() => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }, []);

  // Filtros iniciales: últimos 30 días hasta hoy
  const [filters, setFilters] = useState<DashboardFilters>(() => {
    const d = new Date();
    const to = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(d.getDate()).padStart(2, "0")}`;

    const fromD = new Date(d);
    fromD.setDate(fromD.getDate() - 29);
    const y = fromD.getFullYear();
    const m = String(fromD.getMonth() + 1).padStart(2, "0");
    const day = String(fromD.getDate()).padStart(2, "0");

    return {
      proyecto: "",
      placa: "",
      conductor: "",
      estado: "",
      q: "",
      from: `${y}-${m}-${day}`,
      to,
    };
  });

  // Datos base
  const [formularios, setFormularios] = useState<Formulario[]>([]);
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [loading, setLoading] = useState(false);

  // Opciones derivadas (para filtros)
  const opciones = useMemo(() => {
    const proyectos = Array.from(
      new Set(
        formularios
          .map((f) => f.proyecto)
          .filter((x): x is string => Boolean(x && x.trim()))
      )
    );
    const placas = Array.from(
      new Set(
        formularios.map((f) => f.placa).filter((x) => Boolean(x && x.trim()))
      )
    );
    const conductores = Array.from(
      new Set(
        formularios
          .map((f) => f.conductor)
          .filter((x) => Boolean(x && x.trim()))
      )
    );
    const estados = Array.from(
      new Set(
        vehiculos
          .map((v) => v.estado)
          .filter((x): x is string => Boolean(x && (x as string).trim()))
      )
    );

    return { proyectos, placas, conductores, estados };
  }, [formularios, vehiculos]);

  // Carga inicial
  useEffect(() => {
    setLoading(true);
    Promise.allSettled([
      axios.get(`${base}/formularios`),
      axios.get(`${base}/vehiculos`),
    ])
      .then(([fRes, vRes]) => {
        if (fRes.status === "fulfilled") {
          setFormularios(Array.isArray(fRes.value.data) ? fRes.value.data : []);
        } else {
          enqueue("No se pudieron cargar formularios", "error");
        }

        if (vRes.status === "fulfilled") {
          setVehiculos(Array.isArray(vRes.value.data) ? vRes.value.data : []);
        } else {
          enqueue("No se pudieron cargar vehículos", "error");
        }
      })
      .finally(() => setLoading(false));
  }, []);

  // KPIs + series + rankings
  const {
    kpiHoy,
    kpiSemana,
    kpiMes,
    cumplimientoPct,
    cumplimientoDelta,
    activos,
    mantenimiento,
    alertas,
    serieDiaria,
    topVehiculos,
    topConductores,
  } = useMemo(() => {
    // Filtrado por rango/criterios
    const f = formularios.filter((x) => {
      const texto = `${x.codigo ?? ""} ${x.placa ?? ""} ${
        x.conductor ?? ""
      }`.toLowerCase();
      const coincideTexto =
        !filters.q || texto.includes(filters.q.toLowerCase());

      return (
        inRange(x.fecha, filters.from, filters.to) &&
        (!filters.placa || x.placa === filters.placa) &&
        (!filters.conductor || x.conductor === filters.conductor) &&
        (!filters.proyecto || x.proyecto === filters.proyecto) &&
        coincideTexto
      );
    });

    // Hoy
    const hoyCount = f.filter((x) => x.fecha === today).length;

    // Últimos 7 días (respecto a filters.to)
    const sevenAgo = new Date(toDate(filters.to));
    sevenAgo.setDate(sevenAgo.getDate() - 6);
    const sevenFrom = `${sevenAgo.getFullYear()}-${String(
      sevenAgo.getMonth() + 1
    ).padStart(2, "0")}-${String(sevenAgo.getDate()).padStart(2, "0")}`;
    const semanaCount = f.filter((x) =>
      inRange(x.fecha, sevenFrom, filters.to)
    ).length;

    // Mes en curso (según "to")
    const toRef = toDate(filters.to);
    const monthFrom = `${toRef.getFullYear()}-${String(
      toRef.getMonth() + 1
    ).padStart(2, "0")}-01`;
    const mesCount = f.filter((x) =>
      inRange(x.fecha, monthFrom, filters.to)
    ).length;

    // Cumplimiento (actual vs periodo anterior del mismo tamaño)
    const countChecks = (arr: Formulario[]) => {
      let total = 0;
      let cumple = 0;
      let noCumple = 0;
      arr.forEach((frm) => {
        const sections = [
          sumSection(frm.documentos),
          sumSection(frm.carroceria),
          sumSection(frm.antesEncender),
          sumSection(frm.botiquin),
          sumSection(frm.vehiculoEncendido),
        ];
        sections.forEach((s) => {
          total += s.total;
          cumple += s.cumple;
          noCumple += s.noCumple;
        });
      });
      const pct = total > 0 ? Math.round((cumple / total) * 100) : 0;
      return { pct, noCumple };
    };

    const currentChecks = countChecks(f);

    // Periodo anterior (mismo tamaño que el rango actual)
    const spanDays =
      Math.ceil(
        (toDate(filters.to).getTime() - toDate(filters.from).getTime()) /
          (1000 * 3600 * 24)
      ) + 1;

    const prevTo = new Date(toDate(filters.from));
    prevTo.setDate(prevTo.getDate() - 1);
    const prevFrom = new Date(prevTo);
    prevFrom.setDate(prevFrom.getDate() - (spanDays - 1));

    const prevFromStr = `${prevFrom.getFullYear()}-${String(
      prevFrom.getMonth() + 1
    ).padStart(2, "0")}-${String(prevFrom.getDate()).padStart(2, "0")}`;
    const prevToStr = `${prevTo.getFullYear()}-${String(
      prevTo.getMonth() + 1
    ).padStart(2, "0")}-${String(prevTo.getDate()).padStart(2, "0")}`;

    const fPrev = formularios.filter(
      (x) =>
        inRange(x.fecha, prevFromStr, prevToStr) &&
        (!filters.placa || x.placa === filters.placa) &&
        (!filters.conductor || x.conductor === filters.conductor) &&
        (!filters.proyecto || x.proyecto === filters.proyecto)
    );
    const prevChecks = countChecks(fPrev);

    const delta =
      prevChecks.pct === 0 && currentChecks.pct === 0
        ? 0
        : prevChecks.pct === 0
        ? 100
        : Math.round(
            ((currentChecks.pct - prevChecks.pct) /
              Math.max(prevChecks.pct, 1)) *
              100
          );

    // Vehículos
    const activos = vehiculos.filter((v) => v.estado === "Activo").length;
    const mantenimiento = vehiculos.filter(
      (v) => v.estado === "Mantenimiento"
    ).length;

    // Serie diaria (from..to)
    const days: string[] = [];
    if (filters.from && filters.to) {
      const start = new Date(filters.from);
      const end = new Date(filters.to);
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        days.push(`${y}-${m}-${day}`);
      }
    }
    const serieDiaria: TimePoint[] = days.map((ds) => ({
      date: ds,
      value: f.filter((x) => x.fecha === ds).length,
    }));

    // Rankings
    const countBy = (arr: typeof f, key: "placa" | "conductor") => {
      const map = new Map<string, number>();
      arr.forEach((it) => {
        const k = (it[key] || "").trim();
        if (!k) return;
        map.set(k, (map.get(k) || 0) + 1);
      });
      return Array.from(map.entries())
        .map(([label, value]) => ({ label, value }))
        .sort((a, b) => b.value - a.value);
    };

    const topVehiculos: TopItem[] = countBy(f, "placa");
    const topConductores: TopItem[] = countBy(f, "conductor");

    return {
      kpiHoy: hoyCount,
      kpiSemana: semanaCount,
      kpiMes: mesCount,
      cumplimientoPct: currentChecks.pct,
      cumplimientoDelta: isFinite(delta) ? delta : 0,
      activos,
      mantenimiento,
      alertas: currentChecks.noCumple,
      serieDiaria,
      topVehiculos,
      topConductores,
    };
  }, [formularios, vehiculos, filters, today]);

  return (
    <PageContainer>
      <FiltersBar
        filters={filters}
        onChange={(p) => setFilters((prev) => ({ ...prev, ...p }))}
        proyectos={opciones.proyectos}
        placas={opciones.placas}
        conductores={opciones.conductores}
        estados={opciones.estados}
      />

      <Grid container spacing={2} sx={{ mb: 1 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard
            icon="today"
            label="Preoperaciones (hoy)"
            value={kpiHoy}
            loading={Boolean(loading)}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard
            icon="date_range"
            label="Últimos 7 días"
            value={kpiSemana}
            loading={Boolean(loading)}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard
            icon="calendar_month"
            label="Mes en curso"
            value={kpiMes}
            loading={Boolean(loading)}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard
            icon="check_circle"
            label="Cumplimiento"
            value={`${cumplimientoPct}%`}
            delta={cumplimientoDelta}
            loading={Boolean(loading)}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard
            icon="directions_car"
            label="Vehículos activos"
            value={activos}
            loading={Boolean(loading)}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard
            icon="build_circle"
            label="En mantenimiento"
            value={mantenimiento}
            loading={Boolean(loading)}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard
            icon="warning"
            label="Alertas abiertas"
            value={alertas}
            loading={Boolean(loading)}
          />
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid size={{ xs: 12, md: 16 }}>
          <TimeSeries
            title="Tendencia de preoperacionales"
            data={serieDiaria}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TopBars title="Top vehículos" items={topVehiculos} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TopBars title="Top conductores" items={topConductores} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {/* Espacio para otra tarjeta (p. ej., Cumplimiento por categoría) */}
        </Grid>
      </Grid>

      <LoadingBackdrop open={Boolean(loading)} />
    </PageContainer>
  );
};

export default Dashboard;
