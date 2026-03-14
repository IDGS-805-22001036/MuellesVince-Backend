import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ClientesModule } from './clientes/clientes.module';
import { ProveedoresModule } from './proveedores/proveedores.module';
import { FormasPagoModule } from './formas-pago/formas-pago.module';
import { CuentasPorPagarModule } from './cuentas-por-pagar/cuentas-por-pagar.module';
import { CuentasPorCobrarModule } from './cuentas-por-cobrar/cuentas-por-cobrar.module';
import { GastosModule } from './gastos/gastos.module';
import { IngresosModule } from './ingresos/ingresos.module';
import { FacturasModule } from './facturas/facturas.module';
import { CotizacionesModule } from './cotizaciones/cotizaciones.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '1001368',
      database: 'taller_admin',
      autoLoadEntities: true,
      synchronize: false,
    }),

    UsuariosModule,
    AuthModule,
    ClientesModule,
    ProveedoresModule,
    FormasPagoModule,
    CuentasPorPagarModule,
    CuentasPorCobrarModule,
    GastosModule,
    IngresosModule,
    FacturasModule,
    CotizacionesModule,
  ],
})
export class AppModule {}