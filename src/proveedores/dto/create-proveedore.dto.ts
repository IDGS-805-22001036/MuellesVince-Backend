import { IsEmail, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateProveedoreDto {
  @IsString()
  @MaxLength(150)
  nombre: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  telefono?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(120)
  correo?: string;

  @IsOptional()
  @IsString()
  direccion?: string;

  @IsOptional()
  @IsString()
  @MaxLength(13)
  rfc?: string;
}