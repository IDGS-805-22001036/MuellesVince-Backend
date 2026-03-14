import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FormasPago } from './entities/formas-pago.entity';
import { CreateFormasPagoDto } from './dto/create-formas-pago.dto';
import { UpdateFormasPagoDto } from './dto/update-formas-pago.dto';

@Injectable()
export class FormasPagoService {
  constructor(
    @InjectRepository(FormasPago)
    private readonly repo: Repository<FormasPago>,
  ) {}

  create(dto: CreateFormasPagoDto) {
    return this.repo.save(this.repo.create(dto));
  }

  findAll() {
    return this.repo.find({ order: { id_forma_pago: 'ASC' } });
  }

  async findOne(id: number) {
    const item = await this.repo.findOneBy({ id_forma_pago: id });
    if (!item) throw new NotFoundException('Forma de pago no encontrada');
    return item;
  }

  async update(id: number, dto: UpdateFormasPagoDto) {
    const item = await this.findOne(id);
    Object.assign(item, dto);
    return this.repo.save(item);
  }

  async remove(id: number) {
    const res = await this.repo.delete({ id_forma_pago: id });
    if (!res.affected) throw new NotFoundException('Forma de pago no encontrada');
    return { deleted: true };
  }
}