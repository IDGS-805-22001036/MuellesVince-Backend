export class CreateIngresoDto {
  fecha: string;
  concepto: string;
  monto: string;
  id_cliente?: number;
  id_cxc?: number;
}