import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CuentasPorCobrarService } from './cuentas-por-cobrar.service';
import { CuentasPorCobrarController } from './cuentas-por-cobrar.controller';
import { CuentasPorCobrar } from './entities/cuentas-por-cobrar.entity';
import { Cliente } from '../clientes/entities/cliente.entity';

import { IngresosModule } from '../ingresos/ingresos.module';
import { FormasPago } from 'src/formas-pago/entities/formas-pago.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CuentasPorCobrar, Cliente, FormasPago]),
    IngresosModule,
  ],
  controllers: [CuentasPorCobrarController],
  providers: [CuentasPorCobrarService],
  exports: [CuentasPorCobrarService],
})
export class CuentasPorCobrarModule {}