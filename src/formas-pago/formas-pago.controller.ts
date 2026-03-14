import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FormasPagoService } from './formas-pago.service';
import { CreateFormasPagoDto } from './dto/create-formas-pago.dto';
import { UpdateFormasPagoDto } from './dto/update-formas-pago.dto';

@Controller('formas-pago')
export class FormasPagoController {
  constructor(private readonly formasPagoService: FormasPagoService) {}

  @Post()
  create(@Body() createFormasPagoDto: CreateFormasPagoDto) {
    return this.formasPagoService.create(createFormasPagoDto);
  }

  @Get()
  findAll() {
    return this.formasPagoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.formasPagoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFormasPagoDto: UpdateFormasPagoDto) {
    return this.formasPagoService.update(+id, updateFormasPagoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.formasPagoService.remove(+id);
  }
}
