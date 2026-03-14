import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class CreateCotizacionDetalleDto {
  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0.01)
  cantidad: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  precio_unitario: number;
}

export class CreateCotizacioneDto {
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  @Length(1, 150)
  nombre_cliente: string;

  @IsOptional()
  @IsString()
  @Length(0, 30)
  telefono?: string;

  @IsOptional()
  @IsEmail()
  @Length(0, 120)
  correo?: string;

  @IsOptional()
  @IsString()
  direccion?: string;

  @IsOptional()
  @IsString()
  @Length(0, 13)
  rfc?: string;

  @IsOptional()
  @IsDateString()
  fecha?: string;

  @IsOptional()
  @IsString()
  notas?: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  ivaPorcentaje: number;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateCotizacionDetalleDto)
  detalles: CreateCotizacionDetalleDto[];
}