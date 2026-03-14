import { PartialType } from '@nestjs/mapped-types';
import { CreateFormasPagoDto } from './create-formas-pago.dto';

export class UpdateFormasPagoDto extends PartialType(CreateFormasPagoDto) {}
