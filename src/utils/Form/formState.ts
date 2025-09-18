export type GroupValues = Record<string, string>;
export type FormState = {
  //DATOS
  placa: string;
  documentos: GroupValues;
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
  observaciones: string;
  cumplimiento: GroupValues;
  carroceria: GroupValues;
  antesEncender: GroupValues;
  botiquin: GroupValues;
  vehiculoEncendido: GroupValues;
  //
  grupoId: string;
  //DATOS RELEVO
  tieneRelevo: "si" | "no";
  rolEtapa: "principal" | "relevo";
  conductorRelevo: string;
  fechaInicioRelevo: string;
  horaInicioRelevo: string;
  kmInicioRelevo: string;
  fechaFinRelevo: string;
  horaFinRelevo: string;
  kmFinRelevo: string;
  observacionesRelevo: string;
  // FINAL PREOPERACIONAL
  fechaFinPO: string;
  horaFinPO: string;
  kmFinPO: string;
};

export const initialState: FormState = {
  placa: "",
  documentos: {},
  proyecto: "",
  destino: "",
  fechaSoat: "",
  fechaTecno: "",
  responsable: "",
  conductor: "",
  fechaInicio: "",
  horaInicio: "",
  kmInicio: "",
  inspector: "",
  observaciones: "",
  cumplimiento: {},
  carroceria: {},
  antesEncender: {},
  botiquin: {},
  vehiculoEncendido: {},
  grupoId: "",
  //DATOS RELEVO
  tieneRelevo: "no",
  rolEtapa: "principal",
  conductorRelevo: "",
  fechaInicioRelevo: "",
  horaInicioRelevo: "",
  kmInicioRelevo: "",
  fechaFinRelevo: "",
  horaFinRelevo: "",
  kmFinRelevo: "",
  observacionesRelevo: "",
  // FINAL
  fechaFinPO: "",
  horaFinPO: "",
  kmFinPO: "",
};
