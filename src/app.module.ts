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
import { env } from 'process';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'turntable.proxy.rlwy.net',
      port: 14899,
      username: 'postgres',
      password: 'HCKpqWqZTGybZUiBfiuBXnABdxxkHVEs',
      database: 'railway',
      autoLoadEntities: true,
      synchronize: false,
      ssl: {
        rejectUnauthorized: false,
      },
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