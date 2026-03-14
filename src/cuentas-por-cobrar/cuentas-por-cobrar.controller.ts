import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CuentasPorCobrarService } from './cuentas-por-cobrar.service';
import { CreateCuentasPorCobrarDto } from './dto/create-cuentas-por-cobrar.dto';
import { UpdateCuentasPorCobrarDto } from './dto/update-cuentas-por-cobrar.dto';

@Controller('cuentas-por-cobrar')
export class CuentasPorCobrarController {
  constructor(private readonly service: CuentasPorCobrarService) {}

  @Post()
  create(@Body() dto: CreateCuentasPorCobrarDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCuentasPorCobrarDto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}