import { Type } from 'class-transformer';
import { IsDateString, IsInt, IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class CreateCuentasPorCobrarDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
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
  estatus?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  id_cliente?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  forma_pago?: number;
}