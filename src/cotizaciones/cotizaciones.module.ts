import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CotizacionesService } from './cotizaciones.service';
import { CotizacionesController } from './cotizaciones.controller';
import { Cotizacione } from './entities/cotizacione.entity';
import { CotizacionDetalle } from './entities/cotizacion-detalle.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cotizacione, CotizacionDetalle])],
  controllers: [CotizacionesController],
  providers: [CotizacionesService],
  exports: [CotizacionesService],
})
export class CotizacionesModule {}