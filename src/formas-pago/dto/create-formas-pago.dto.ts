import { IsString, MaxLength } from 'class-validator';

export class CreateFormasPagoDto {
  @IsString()
  @MaxLength(50)
  nombre: string;
}