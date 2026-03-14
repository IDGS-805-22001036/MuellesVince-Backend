import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FormasPagoService } from './formas-pago.service';
import { FormasPagoController } from './formas-pago.controller';
import { FormasPago } from './entities/formas-pago.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FormasPago])],
  controllers: [FormasPagoController],
  providers: [FormasPagoService],
})
export class FormasPagoModule {}