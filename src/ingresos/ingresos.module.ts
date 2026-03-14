import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IngresosService } from './ingresos.service';
import { IngresosController } from './ingresos.controller';
import { Ingreso } from './entities/ingreso.entity';
import { Cliente } from '../clientes/entities/cliente.entity';
import { CuentasPorCobrar } from '../cuentas-por-cobrar/entities/cuentas-por-cobrar.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ingreso, Cliente, CuentasPorCobrar])],
  controllers: [IngresosController],
  providers: [IngresosService],
  exports: [IngresosService],
})
export class IngresosModule {}