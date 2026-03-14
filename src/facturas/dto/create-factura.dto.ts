import { Transform } from 'class-transformer';
import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class CreateFacturaDto {
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toUpperCase() : value
  )
  @IsString()
  @IsNotEmpty()
  @IsIn(['INGRESO', 'GASTO'])
  tipo: string;
}