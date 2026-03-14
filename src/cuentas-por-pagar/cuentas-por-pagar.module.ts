import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CuentasPorPagarService } from './cuentas-por-pagar.service';
import { CuentasPorPagarController } from './cuentas-por-pagar.controller';
import { CuentasPorPagar } from './entities/cuentas-por-pagar.entity';
import { Proveedore } from '../proveedores/entities/proveedore.entity';
import { FormasPago } from '../formas-pago/entities/formas-pago.entity';
import { GastosModule } from '../gastos/gastos.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CuentasPorPagar, Proveedore, FormasPago]),
    GastosModule,
  ],
  controllers: [CuentasPorPagarController],
  providers: [CuentasPorPagarService],
  exports: [CuentasPorPagarService],
})
export class CuentasPorPagarModule {}