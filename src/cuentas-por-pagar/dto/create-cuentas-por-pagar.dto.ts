import { IsDateString, IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class CreateCuentasPorPagarDto {
  @IsOptional()
  @Min(0)
  monto?: number;

  @IsOptional()
  @IsDateString()
  fecha_registro?: string;

  @IsOptional()
  @IsDateString()
  fecha_vencimiento?: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  estatus?: string; // 'Pagado' o 'Por pagar' según tu BD

  @IsOptional()
  @IsInt()
  id_proveedor?: number;

  @IsOptional()
  @IsInt()
  forma_pago?: number;
}

