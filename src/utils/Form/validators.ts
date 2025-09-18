import {
  DOCUMENTOS,
  CUMPLIMIENTO,
  CARROCERIA,
  ANTES_ENCENDER,
  BOTIQUIN_HERRAMIENTAS,
  VEHICULO_ENCENDIDO,
} from "../../_constants/formOptions.ts";

export type FormValues = {
  placa: string;
  documentos: Record<string, string>;
  proyecto: string;
  destino: string;
  fechaSoat: string;
  fechaTecno: string;
  responsable: string;
  conductor: string;
  fechaInicio: string;
  horaInicio: string;
  kmInicio: string;
  inspector: string;
  cumplimiento: Record<string, string>;
  carroceria: Record<string, string>;
  antesEncender: Record<string, string>;
  botiquin: Record<string, string>;
  vehiculoEncendido: Record<string, string>;

  // conductorRelevo: string;
  // fechaInicioRelevo: string;
  // horaInicioRelevo: string;
  // kmInicioRelevo: string;
};

const validarGrupo = (
  nombre: string,
  items: string[],
  valores: Record<string, string>,
  errores: Record<string, string>
) => {
  items.forEach((item) => {
    if (!valores[item]) {
      // la clave coincide con lo que espera <FormInspeccion />
      errores[`${nombre}.${item}`] = "Seleccione";
    }
  });
};

export const validarPaso1 = (values: FormValues) => {
  const errores: Record<string, string> = {};

  // Campos de texto/fecha/num obligatorios
  if (!values.placa.trim()) errores.placa = "La placa es obligatoria";
  if (!values.proyecto.trim()) errores.proyecto = "El proyecto es obligatorio";
  if (!values.destino.trim()) errores.destino = "El destino es obligatorio";
  if (!values.fechaSoat.trim())
    errores.fechaSoat = "La vigencia del SOAT es obligatoria";
  if (!values.fechaTecno.trim())
    errores.fechaTecno = "La vigencia de la tecnomecánica es obligatoria";
  if (!values.responsable.trim())
    errores.responsable = "El responsable es obligatorio";
  if (!values.conductor.trim())
    errores.conductor = "El conductor es obligatorio";
  if (!values.fechaInicio.trim())
    errores.fechaInicio = "La fecha de inicio es obligatoria";
  if (!values.horaInicio.trim())
    errores.horaInicio = "La hora de inicio es obligatoria";
  if (!values.kmInicio.trim())
    errores.kmInicio = "El kilometraje inicial es obligatorio";
  if (!values.inspector.trim())
    errores.inspector = "El inspector es obligatorio";

  // if (!values.conductorRelevo.trim())
  //   errores.conductorRelevo = "El conductor del relevo es obligatorio";

  // if (!values.fechaInicioRelevo.trim())
  //   errores.fechaInicioRelevo = "La fecha de inicio del relevo es obligatoria";

  // if (!values.horaInicioRelevo.trim())
  //   errores.horaInicioRelevo = "La hora de inicio del relevo es obligatoria";

  // if (!values.kmInicioRelevo.trim())
  //   errores.kmInicioRelevo = "El kilometraje inicial del relevo es obligatorio";

  // Secciones de inspección (cada ítem debe tener valor)
  validarGrupo("documentos", DOCUMENTOS, values.documentos, errores);
  validarGrupo("cumplimiento", CUMPLIMIENTO, values.cumplimiento, errores);
  validarGrupo("carroceria", CARROCERIA, values.carroceria, errores);
  validarGrupo("antesEncender", ANTES_ENCENDER, values.antesEncender, errores);
  validarGrupo("botiquin", BOTIQUIN_HERRAMIENTAS, values.botiquin, errores);
  validarGrupo(
    "vehiculoEncendido",
    VEHICULO_ENCENDIDO,
    values.vehiculoEncendido,
    errores
  );
  return errores;
};
