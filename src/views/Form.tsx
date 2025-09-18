// src/views/Form.tsx
import React, {
  lazy,
  Suspense,
  useReducer,
  useEffect,
  useMemo,
  useCallback,
  useState,
} from "react";
import {
  Box,
  Card,
  Typography,
  Button,
  Stepper,
  Step,
  StepLabel,
  Divider,
  TextField,
  Grid,
  FormControl,
  FormLabel,
  Select,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  useTheme,
  useMediaQuery,
  CircularProgress,
} from "@mui/material";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useSnackbar } from "../components/SnackbarProvider";
import { validarPaso1 } from "../utils/Form/validators";
import type { FormValues } from "../utils/Form/validators";
import {
  DOCUMENTOS,
  CARROCERIA,
  ANTES_ENCENDER,
  BOTIQUIN_HERRAMIENTAS,
  VEHICULO_ENCENDIDO,
  CUMPLIMIENTO,
} from "../_constants/formOptions";

import type { FormState, GroupValues } from "../utils/Form/formState";
import { initialState } from "../utils/Form/formState";

import { formReducer } from "../utils/Form/formReducer";

// Lazy-loaded components (split bundle)
const PageContainer = lazy(() => import("../components/PageContainer"));
const CamposGrid = lazy(() => import("../components/Form/CamposGrid"));
const FormInspeccion = lazy(() => import("../components/Form/FormInspeccion"));
const LoadingBackdrop = lazy(() => import("../components/LoadingBackdrop"));

type FormMode = "crear" | "editar" | "ver";

const base = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

/* ---------- Component ---------- */
const Form: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { usuario } = useAuth();
  const { enqueue } = useSnackbar();

  const mode: FormMode = location.pathname.includes("ver")
    ? "ver"
    : id
    ? "editar"
    : "crear";

  // Stepper
  const [activeStep, setActiveStep] = useState(0);
  const steps = ["Datos", "Resumen", "Confirmación"];

  // Reducer for form data
  const [state, dispatch] = useReducer(formReducer, initialState);

  // Errors + saving
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  // Stable setter functions for fields (memoized)
  // ---------- Setters (DRY) ----------
  const setField = useCallback(
    (field: keyof FormState) => (value: any) => {
      dispatch({ type: "SET_FIELD", field, value });
    },
    [dispatch]
  );

  const setGroup = useCallback(
    (group: keyof FormState) => (item: string, value: string) => {
      dispatch({ type: "SET_GROUP", group, item, value });
    },
    [dispatch]
  );

  // Ahora creamos los objetos que usaban los componentes hijos (memoizados)
  const fieldSetters = useMemo(
    () => ({
      conductor: setField("conductor"),
      placa: setField("placa"),
      proyecto: setField("proyecto"),
      responsable: setField("responsable"),
      fechaInicio: setField("fechaInicio"),
      horaInicio: setField("horaInicio"),
      kmInicio: setField("kmInicio"),
      destino: setField("destino"),
      fechaSoat: setField("fechaSoat"),
      fechaTecno: setField("fechaTecno"),
      inspector: setField("inspector"),
      observaciones: setField("observaciones"),
      grupoId: setField("grupoId"),
      tieneRelevo: setField("tieneRelevo"),
      rolEtapa: setField("rolEtapa"),
    }),
    [setField]
  );

  const groupSetters = useMemo(
    () => ({
      documentos: setGroup("documentos"),
      cumplimiento: setGroup("cumplimiento"),
      carroceria: setGroup("carroceria"),
      antesEncender: setGroup("antesEncender"),
      botiquin: setGroup("botiquin"),
      vehiculoEncendido: setGroup("vehiculoEncendido"),
    }),
    [setGroup]
  );

  // auto-scroll to top on step change (UX)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeStep]);

  // Load data if editing / viewing
  useEffect(() => {
    if (!id) return;
    const source = axios.CancelToken.source();
    setSaving(true);
    axios
      .get(`${base}/formularios/${id}`, { cancelToken: source.token })
      .then((res) => {
        const data = res.data || {};
        // map backend fields to state
        dispatch({
          type: "SET_ALL",
          payload: {
            conductor: data.conductor || "",
            placa: data.placa || "",
            proyecto: data.proyecto || "",
            responsable: data.responsable || "",
            fechaInicio: data.fechaInicio || "",
            horaInicio: data.horaInicio || "",
            kmInicio: data.kmInicio || "",
            destino: data.destino || "",
            fechaSoat: data.fechaSoat || "",
            fechaTecno: data.fechaTecno || "",
            inspector: data.inspector || "",
            observaciones: data.observaciones || "",
            documentos: data.documentos || {},
            cumplimiento: data.cumplimiento || {},
            carroceria: data.carroceria || {},
            antesEncender: data.antesEncender || {},
            botiquin: data.botiquin || {},
            vehiculoEncendido: data.vehiculoEncendido || {},
            grupoId: data.grupoId || "",
            tieneRelevo: data.tieneRelevo ? "si" : "no",
            rolEtapa: data.rolEtapa || "principal",
          },
        });
      })
      .catch((err) => {
        if (axios.isCancel(err)) return;
        enqueue("Error cargando formulario", "error");
      })
      .finally(() => setSaving(false));
    return () => source.cancel();
  }, [id, enqueue]);

  // Build payload helper
  const buildPayload = useCallback(
    (extra: Record<string, any>) => ({
      grupoId: state.grupoId || undefined,
      conductor: state.conductor,
      placa: state.placa,
      proyecto: state.proyecto,
      responsable: state.responsable,
      fechaInicio: state.fechaInicio,
      horaInicio: state.horaInicio,
      kmInicio: state.kmInicio,
      destino: state.destino,
      fechaSoat: state.fechaSoat,
      fechaTecno: state.fechaTecno,
      inspector: state.inspector,
      observaciones: state.observaciones,
      documentos: state.documentos,
      cumplimiento: state.cumplimiento,
      carroceria: state.carroceria,
      antesEncender: state.antesEncender,
      botiquin: state.botiquin,
      vehiculoEncendido: state.vehiculoEncendido,
      usuario: usuario?.username ?? "anon",
      fecha: new Date().toISOString().split("T")[0],
      codigo: `F-${Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0")}`,
      tieneRelevo: state.tieneRelevo === "si",
      rolEtapa: state.rolEtapa,
      ...extra,
    }),
    [state, usuario]
  );

  // Submit (create/update) - finalizar indicates finalization
  const handleSubmit = useCallback(
    async (finalizar: boolean) => {
      try {
        setSaving(true);
        if (mode === "crear") {
          await axios.post(
            `${base}/formularios`,
            buildPayload({ estado: finalizar ? "Finalizado" : "En proceso" })
          );
          enqueue(
            finalizar ? "Formulario finalizado" : "Formulario guardado",
            "success"
          );
        } else if (mode === "editar") {
          await axios.put(
            `${base}/formularios/${id}`,
            buildPayload({ estado: finalizar ? "Finalizado" : "En proceso" })
          );
          enqueue(
            finalizar
              ? "Formulario actualizado y finalizado"
              : "Formulario actualizado",
            "success"
          );
        }
        navigate("/principal");
      } catch (e) {
        enqueue("Error al guardar formulario", "error");
      } finally {
        setSaving(false);
      }
    },
    [buildPayload, enqueue, id, mode, navigate]
  );

  // Validación: usa validator centralizado
  const validarPaso1Local = useCallback(() => {
    const values: FormValues = {
      //Agregar nuvos campos, formOptions.ts, validators.ts, formState.ts
      placa: state.placa,
      documentos: state.documentos,
      proyecto: state.proyecto,
      destino: state.destino,
      fechaSoat: state.fechaSoat,
      fechaTecno: state.fechaTecno,
      responsable: state.responsable,
      conductor: state.conductor,
      fechaInicio: state.fechaInicio,
      horaInicio: state.horaInicio,
      kmInicio: state.kmInicio,
      inspector: state.inspector,
      cumplimiento: state.cumplimiento,
      carroceria: state.carroceria,
      antesEncender: state.antesEncender,
      botiquin: state.botiquin,
      vehiculoEncendido: state.vehiculoEncendido,
      // conductorRelevo: state.conductorRelevo,
      // fechaInicioRelevo: state.fechaInicioRelevo,
      // horaInicioRelevo: state.horaInicioRelevo,
      // kmInicioRelevo: state.kmInicioRelevo,
    };
    const newErrors = validarPaso1(values);
    setErrores(newErrors);
    if (Object.keys(newErrors).length > 0) {
      enqueue("Completa los campos y secciones obligatorias.", "warning");
      return false;
    }
    return true;
  }, [state, enqueue]);

  /* ---------- UI helpers ---------- */
  // Campos config for CamposGrid (memoized)
  const campos = useMemo(
    () => [
      {
        label: "Conductor *",
        value: state.conductor,
        set: fieldSetters.conductor,
        err: errores.conductor,
        disabled: mode === "ver",
      },
      {
        label: "Placa *",
        value: state.placa,
        set: fieldSetters.placa,
        err: errores.placa,
        disabled: mode === "ver",
      },
      {
        label: "Proyecto *",
        value: state.proyecto,
        set: fieldSetters.proyecto,
        err: errores.proyecto,
        disabled: mode === "ver",
      },
      {
        label: "Ingeniero responsable *",
        value: state.responsable,
        set: fieldSetters.responsable,
        err: errores.responsable,
        disabled: mode === "ver",
      },
      {
        label: "Fecha inicio *",
        type: "date",
        value: state.fechaInicio,
        set: fieldSetters.fechaInicio,
        err: errores.fechaInicio,
        disabled: mode === "ver",
      },
      {
        label: "Hora inicio *",
        type: "time",
        value: state.horaInicio,
        set: fieldSetters.horaInicio,
        err: errores.horaInicio,
        disabled: mode === "ver",
      },
      {
        label: "Kilometraje inicio *",
        type: "number",
        value: state.kmInicio,
        set: fieldSetters.kmInicio,
        err: errores.kmInicio,
        disabled: mode === "ver",
      },
      {
        label: "Destino *",
        value: state.destino,
        set: fieldSetters.destino,
        err: errores.destino,
        disabled: mode === "ver",
      },
      {
        label: "Vigencia SOAT *",
        type: "date",
        value: state.fechaSoat,
        set: fieldSetters.fechaSoat,
        err: errores.fechaSoat,
        disabled: mode === "ver",
      },
      {
        label: "Vigencia Tecnomecánica *",
        type: "date",
        value: state.fechaTecno,
        set: fieldSetters.fechaTecno,
        err: errores.fechaTecno,
        disabled: mode === "ver",
      },
    ],
    [state, errores, fieldSetters, mode]
  );

  // Step content memoized to avoid re-creating JSX unnecessarily
  const StepContent = useMemo(() => {
    const Paso1 = (
      <>
        <Typography
          variant={isMobile ? "h6" : "h5"}
          fontWeight={700}
          color="primary"
          mb={3}
        >
          Información general del conductor principal
        </Typography>

        <Suspense
          fallback={
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              minHeight={120}
            >
              <CircularProgress color="primary" />
            </Box>
          }
        >
          <CamposGrid items={campos as any} />
        </Suspense>

        <Box mt={4}>
          <Suspense fallback={<CircularProgress color="primary" />}>
            <FormInspeccion
              titulo="Documentos"
              nombreEstado="documentos"
              items={DOCUMENTOS}
              valores={state.documentos}
              onChange={groupSetters.documentos}
              errores={errores}
              disabled={mode === "ver"}
            />
            <FormInspeccion
              titulo="Cumplimiento"
              nombreEstado="cumplimiento"
              items={CUMPLIMIENTO}
              valores={state.cumplimiento}
              onChange={groupSetters.cumplimiento}
              errores={errores}
              disabled={mode === "ver"}
            />
            <FormInspeccion
              titulo="Inspección de la carrocería"
              nombreEstado="carroceria"
              items={CARROCERIA}
              valores={state.carroceria}
              onChange={groupSetters.carroceria}
              errores={errores}
              disabled={mode === "ver"}
            />
            <FormInspeccion
              titulo="Antes de encender el motor"
              nombreEstado="antesEncender"
              items={ANTES_ENCENDER}
              valores={state.antesEncender}
              onChange={groupSetters.antesEncender}
              errores={errores}
              disabled={mode === "ver"}
            />
            <FormInspeccion
              titulo="Botiquín y herramientas"
              nombreEstado="botiquin"
              items={BOTIQUIN_HERRAMIENTAS}
              valores={state.botiquin}
              onChange={groupSetters.botiquin}
              errores={errores}
              disabled={mode === "ver"}
            />
            <FormInspeccion
              titulo="Vehículo encendido"
              nombreEstado="vehiculoEncendido"
              items={VEHICULO_ENCENDIDO}
              valores={state.vehiculoEncendido}
              onChange={groupSetters.vehiculoEncendido}
              errores={errores}
              disabled={mode === "ver"}
            />
          </Suspense>
        </Box>

        <Box mt={3}>
          <Typography fontWeight={600}>Inspector *</Typography>
          <TextField
            fullWidth
            value={state.inspector}
            onChange={(e) => fieldSetters.inspector(e.target.value)}
            error={!!errores.inspector}
            helperText={errores.inspector}
            disabled={mode === "ver"}
          />
        </Box>

        <Box mt={3}>
          <Typography fontWeight={600}>Observaciones</Typography>
          <TextField
            fullWidth
            multiline
            minRows={3}
            value={state.observaciones}
            onChange={(e) => fieldSetters.observaciones(e.target.value)}
            disabled={mode === "ver"}
          />
        </Box>
      </>
    );

    const Paso2 = (
      <>
        <Typography variant="h6" fontWeight={700} mb={1}>
          Relevo
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={2}>
          Verifica que la información esté correcta antes de continuar.
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Grid container spacing={2}>
          {[
            ["Conductor", state.conductor],
            ["Placa", state.placa],
            ["Proyecto", state.proyecto],
            ["Ingeniero responsable", state.responsable],
            ["Fecha inicio", state.fechaInicio],
            ["Hora inicio", state.horaInicio],
            ["Kilometraje inicio", state.kmInicio],
            ["Destino", state.destino],
            ["Vigencia SOAT", state.fechaSoat],
            ["Vigencia Tecnicomecánica", state.fechaTecno],
            ["Inspector", state.inspector],
            ["Observaciones", state.observaciones],
          ].map(([k, v]) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={String(k)}>
              <Typography fontWeight={600}>{k}</Typography>
              <Typography>{(v as string) || "-"}</Typography>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ my: 2 }} />
        <Typography fontWeight={600} mb={1}>
          (Opcional) Asociar a preoperacional existente
        </Typography>
        <TextField
          fullWidth
          placeholder="Pega aquí el grupoId si esto es un relevo"
          value={state.grupoId}
          onChange={(e) => fieldSetters.grupoId(e.target.value)}
          disabled={mode === "ver"}
        />
      </>
    );

    const Paso3 = (
      <>
        <Typography variant="h6" fontWeight={700} mb={2}>
          Confirmación
        </Typography>

        {mode !== "ver" && (
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl>
                <FormLabel>¿Tiene relevo?</FormLabel>
                <RadioGroup
                  row
                  value={state.tieneRelevo}
                  onChange={(e) =>
                    fieldSetters.tieneRelevo(e.target.value as "si" | "no")
                  }
                >
                  <FormControlLabel value="no" control={<Radio />} label="No" />
                  <FormControlLabel value="si" control={<Radio />} label="Sí" />
                </RadioGroup>
              </FormControl>
            </Grid>

            {state.tieneRelevo === "si" && (
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth>
                  <FormLabel>Este formulario es del</FormLabel>
                  <Select
                    size="small"
                    value={state.rolEtapa}
                    onChange={(e) =>
                      fieldSetters.rolEtapa(
                        e.target.value as "principal" | "relevo"
                      )
                    }
                  >
                    <MenuItem value="principal">Principal</MenuItem>
                    <MenuItem value="relevo">Relevo</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            )}
          </Grid>
        )}

        <Box
          mt={3}
          display="flex"
          justifyContent="center"
          gap={2}
          flexWrap="wrap"
        >
          <Button
            variant="outlined"
            onClick={() => setActiveStep((s) => Math.max(0, s - 1))}
            disabled={saving}
          >
            Atrás
          </Button>

          {mode !== "ver" && (
            <>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => handleSubmit(true)}
                disabled={saving}
              >
                {state.tieneRelevo === "no"
                  ? "Finalizar preoperacional"
                  : state.rolEtapa === "principal"
                  ? "Finalizar (principal)"
                  : "Finalizar (relevo)"}
              </Button>
              <Button
                variant="contained"
                onClick={() => handleSubmit(false)}
                disabled={saving}
              >
                {mode === "crear" ? "Guardar" : "Actualizar"}
              </Button>
            </>
          )}
        </Box>
      </>
    );

    if (activeStep === 0) return Paso1;
    if (activeStep === 1) return Paso2;
    return Paso3;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    state,
    errores,
    mode,
    isMobile,
    fieldSetters,
    groupSetters,
    activeStep,
    handleSubmit,
  ]);

  /* ---------- render ---------- */
  return (
    <Suspense fallback={<CircularProgress color="primary" />}>
      <PageContainer>
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3 }}>
          {steps.map((l) => (
            <Step key={l}>
              <StepLabel>{l}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box display="flex" justifyContent="center">
          <Card
            elevation={4}
            sx={{
              width: "100%",
              maxWidth: 1100,
              p: { xs: 2, sm: 3 },
              borderRadius: 4,
            }}
          >
            {StepContent}

            {/* navigation for steps 0 and 1 */}
            <Box
              mt={4}
              display="flex"
              justifyContent="center"
              gap={2}
              flexWrap="wrap"
            >
              {activeStep === 0 && (
                <>
                  <Button
                    variant="outlined"
                    onClick={() => navigate("/principal")}
                    disabled={saving}
                  >
                    Atrás
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => {
                      if (mode === "crear") {
                        if (validarPaso1Local()) setActiveStep(1);
                      } else {
                        setActiveStep(1);
                      }
                    }}
                    disabled={saving}
                  >
                    Siguiente
                  </Button>
                </>
              )}

              {activeStep === 1 && (
                <>
                  <Button
                    variant="outlined"
                    onClick={() => setActiveStep((s) => Math.max(0, s - 1))}
                    disabled={saving}
                  >
                    Atrás
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => setActiveStep((s) => Math.min(2, s + 1))}
                    disabled={saving}
                  >
                    Siguiente
                  </Button>
                </>
              )}
            </Box>
          </Card>
        </Box>

        <Suspense fallback={null}>
          <LoadingBackdrop open={saving} />
        </Suspense>
      </PageContainer>
    </Suspense>
  );
};

export default Form;
