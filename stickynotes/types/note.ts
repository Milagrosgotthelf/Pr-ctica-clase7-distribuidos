export interface Note {
  id: string;
  title: string;
  contenido: string;
  color: string;
  minutosdevalidez: number;
  creadoEn: number | string;
  notificada: boolean;
}

export const COLORES_NOTAS = ["#fef08a", "#bbf7d0", "#bfdbfe", "#fbcfe8", "#fed7aa"];
