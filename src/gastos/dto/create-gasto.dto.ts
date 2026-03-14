export class CreateGastoDto {
  fecha: string;
  concepto: string;
  monto: string;
  id_proveedor?: number;
  id_cxp?: number;
}