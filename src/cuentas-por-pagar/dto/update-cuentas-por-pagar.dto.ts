import { PartialType } from '@nestjs/mapped-types';
import { CreateCuentasPorPagarDto } from './create-cuentas-por-pagar.dto';

export class UpdateCuentasPorPagarDto extends PartialType(CreateCuentasPorPagarDto) {}
