import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CuentasPorPagarService } from './cuentas-por-pagar.service';
import { CreateCuentasPorPagarDto } from './dto/create-cuentas-por-pagar.dto';
import { UpdateCuentasPorPagarDto } from './dto/update-cuentas-por-pagar.dto';

@Controller('cuentas-por-pagar')
export class CuentasPorPagarController {
  constructor(private readonly cuentasPorPagarService: CuentasPorPagarService) {}

  @Post()
  create(@Body() createCuentasPorPagarDto: CreateCuentasPorPagarDto) {
    return this.cuentasPorPagarService.create(createCuentasPorPagarDto);
  }

  @Get()
  findAll() {
    return this.cuentasPorPagarService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cuentasPorPagarService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCuentasPorPagarDto: UpdateCuentasPorPagarDto) {
    return this.cuentasPorPagarService.update(+id, updateCuentasPorPagarDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cuentasPorPagarService.remove(+id);
  }

  
}
