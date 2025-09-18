// src/constants/formOptions.ts
export const OPCIONES = [
  { label: "Cumple", value: "C" },
  { label: "No cumple", value: "NC" },
  { label: "No aplica", value: "NA" },
] as const;

export const DOCUMENTOS = [
  "Tarjeta de propiedad",
  "SOAT",
  "Tecno Mecánica",
  "Tarjeta/Chip suministro combustible",
  "Tag Flypass",
];

export const CUMPLIMIENTO = [
  "Licencia de conducción vigente para el tipo de vehículo",
  "Conductor autorizado por la Empresa",
  "Se verificó el estado de las vías, restricciones vehículares y cobertura del telepeaje",
];

export const CARROCERIA = [
  "Cadena eje cardan disponible y en buen estado",
  "Barra antivuelco",
  "Vidrios panorámico y laterales",
  "Espejos retrovisores",
  "Puertas / Compuertas",
  "Tapa de combustible",
  "Desgaste de llantas (Presión, nivel de desgaste)",
  "Rines sin grietas y espárragos completos",
  "Cinta reflectivas",
  "Banderín, emblemas y logos",
  "Indicadores de tuerca y/o tuercas ajustadas",
];

export const ANTES_ENCENDER = [
  "Aseo cabina",
  "Testigos apagados (Aceite, motor, airbags)",
  "Velocímetro",
  "Sillas / Apoyacabezas",
  "Cinturón de seguridad",
  "Limpia parabrisas en buen estado",
  "Radio de comunicación (Aplica para las minas)",
  "Pedales de control (Acelerador/Freno/Embrague)",
  "Pito funcionando",
  "Luces traseras, delanteras y de reversa",
  "Luces direccionales operativas",
  "Bombillo buggy y baliza (Luz estroboscópica)",
  "Alarma de retroceso",
  "Nivel de aceite motor en límites permisibles",
  "Nivel de aceite hidráulico en límites permisibles",
  "Nivel de líquido refrigerante en límites permisibles",
  "Nivel de líquido de frenos en límites permitidos",
  "Batería y bornes ajustados",
  "Correas tensionadas, alineadas y sin desgaste",
  "Líneas libres de fugas o derrames",
  "Amortiguadores sin grietas o fugas y sin piezas faltantes",
  "Freno de parqueo operativo",
];

export const BOTIQUIN_HERRAMIENTAS = [
  "Botiquín con: antisépticos, un elemento de corte, algodón, gasa estéril, esparadrapo o vendas adhesivas, venda elástica, jabón",
  "Extintor PQS ABC",
  "Tacos de bloqueo (2) / Conos de seguridad (2)",
  "Extensión llata de repuesto y llanta de repuesto",
  "Herramientas: Gato / Destornillador de pala / Destornillador de estría / Llave expansiva / Llave de perno / Llaves / Alicate / Cable de corriente",
  "Linterna",
];

export const VEHICULO_ENCENDIDO = [
  "Nivel de combustible suficiente para el trayecto",
  "Sistema de tracción 4x4",
  "Freno de pedal en buen funcionamiento",
  "Dirección (Vibración y rigidez)",
  "Aire acondicionado",
];
