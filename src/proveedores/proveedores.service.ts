import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Proveedore } from './entities/proveedore.entity';
import { CreateProveedoreDto } from './dto/create-proveedore.dto';
import { UpdateProveedoreDto } from './dto/update-proveedore.dto';

@Injectable()
export class ProveedoresService {
  constructor(
    @InjectRepository(Proveedore)
    private readonly repo: Repository<Proveedore>,
  ) {}

  create(dto: CreateProveedoreDto) {
    return this.repo.save(this.repo.create(dto));
  }

  findAll() {
    return this.repo.find({ order: { id_proveedor: 'ASC' } });
  }

  async findOne(id: number) {
    const item = await this.repo.findOneBy({ id_proveedor: id });
    if (!item) throw new NotFoundException('Proveedor no encontrado');
    return item;
  }

  async update(id: number, dto: UpdateProveedoreDto) {
    const item = await this.findOne(id);
    Object.assign(item, dto);
    return this.repo.save(item);
  }

  async remove(id: number) {
    const res = await this.repo.delete({ id_proveedor: id });
    if (!res.affected) throw new NotFoundException('Proveedor no encontrado');
    return { deleted: true };
  }
}