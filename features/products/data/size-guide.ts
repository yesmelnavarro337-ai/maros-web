export interface SizeGuideRow {
  measurement: string;
  S: number;
  M: number;
  L: number;
  XL: number;
}

export const SIZE_GUIDE_SIZES = ["S", "M", "L", "XL"] as const;

export const SIZE_GUIDE_ROWS: SizeGuideRow[] = [
  { measurement: "Busto", S: 102, M: 106, L: 110, XL: 114 },
  { measurement: "Cintura", S: 100, M: 104, L: 108, XL: 112 },
  { measurement: "Cadera", S: 104, M: 108, L: 112, XL: 116 },
];

export const SIZE_GUIDE_NOTE =
  "Toma las medidas sobre tu cuerpo sin apretar demasiado la cinta. Si estás entre dos tallas, te recomendamos elegir la más amplia.";