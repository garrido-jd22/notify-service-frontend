export type CreditState = {
  code: number;
  name: string;
  group: "originacion" | "cartera";
};

export const CREDIT_STATES: CreditState[] = [
  { code: 0, name: "PROCESANDO", group: "originacion" },
  { code: 1, name: "PENDIENTE", group: "originacion" },
  { code: 2, name: "APROBADO", group: "originacion" },
  { code: 3, name: "RECHAZADO", group: "originacion" },
  { code: 5, name: "FORMALIZADO", group: "originacion" },
  { code: 6, name: "DESEMBOLSANDO", group: "originacion" },
  { code: 13, name: "INCOMPLETO", group: "originacion" },
  { code: 16, name: "PAGO PENDIENTE", group: "originacion" },
  { code: 17, name: "ESPERANDO GARANTIAS", group: "originacion" },
  { code: 18, name: "REFINANCIANDO", group: "originacion" },
  { code: 20, name: "CONTRAPROPUESTA", group: "originacion" },

  { code: 7, name: "DESEMBOLSADO", group: "cartera" },
  { code: 8, name: "PAGADO", group: "cartera" },
  { code: 10, name: "MORA", group: "cartera" },
  { code: 15, name: "CASTIGADO", group: "cartera" },
  { code: 19, name: "REFINANCIADO", group: "cartera" },
];

export const ORIGINACION_STATES = CREDIT_STATES
  .filter((state) => state.group === "originacion")
  .map((state) => state.name);

export const CARTERA_STATES = CREDIT_STATES
  .filter((state) => state.group === "cartera")
  .map((state) => state.name);

export const ORIGINACION_STATES_CODE = CREDIT_STATES.filter(
  (state) => state.group === "originacion"
);

export const CARTERA_STATES_CODE = CREDIT_STATES.filter(
  (state) => state.group === "cartera"
);