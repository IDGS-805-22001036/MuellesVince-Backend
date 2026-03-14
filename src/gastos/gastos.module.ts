import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GastosService } from './gastos.service';
import { GastosController } from './gastos.controller';
import { Gasto } from './entities/gasto.entity';
import { Proveedore } from '../proveedores/entities/proveedore.entity';
import { CuentasPorPagar } from '../cuentas-por-pagar/entities/cuentas-por-pagar.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Gasto, Proveedore, CuentasPorPagar])],
  controllers: [GastosController],
  providers: [GastosService],
  exports: [GastosService],
})
export class GastosModule {}