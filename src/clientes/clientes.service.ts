import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cliente } from './entities/cliente.entity';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';

@Injectable()
export class ClientesService {
  constructor(
    @InjectRepository(Cliente)
    private readonly repo: Repository<Cliente>,
  ) {}

  create(dto: CreateClienteDto) {
    const cliente = this.repo.create(dto);
    return this.repo.save(cliente);
  }

  findAll() {
    return this.repo.find({ order: { id_cliente: 'ASC' } });
  }

  async findOne(id: number) {
    const cliente = await this.repo.findOneBy({ id_cliente: id });
    if (!cliente) throw new NotFoundException('Cliente no encontrado');
    return cliente;
  }

  async update(id: number, dto: UpdateClienteDto) {
    const cliente = await this.findOne(id);
    Object.assign(cliente, dto);
    return this.repo.save(cliente);
  }

  async remove(id: number) {
    const res = await this.repo.delete({ id_cliente: id });
    if (!res.affected) throw new NotFoundException('Cliente no encontrado');
    return { deleted: true };
  }
}