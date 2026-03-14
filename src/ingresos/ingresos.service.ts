import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Ingreso } from './entities/ingreso.entity';
import { Cliente } from '../clientes/entities/cliente.entity';
import { CuentasPorCobrar } from '../cuentas-por-cobrar/entities/cuentas-por-cobrar.entity';
import { CreateIngresoDto } from './dto/create-ingreso.dto';
import { UpdateIngresoDto } from './dto/update-ingreso.dto';

@Injectable()
export class IngresosService {
  constructor(
    @InjectRepository(Ingreso)
    private readonly ingresoRepository: Repository<Ingreso>,

    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,

    @InjectRepository(CuentasPorCobrar)
    private readonly cuentaRepository: Repository<CuentasPorCobrar>,
  ) {}

  async create(createIngresoDto: CreateIngresoDto) {
    const ingreso = new Ingreso();
    ingreso.fecha = createIngresoDto.fecha;
    ingreso.concepto = createIngresoDto.concepto;
    ingreso.monto = createIngresoDto.monto;

    if (createIngresoDto.id_cliente) {
      const cliente = await this.clienteRepository.findOne({
        where: { id_cliente: createIngresoDto.id_cliente },
      });

      if (!cliente) {
        throw new NotFoundException('Cliente no encontrado');
      }

      ingreso.cliente = cliente;
    } else {
      ingreso.cliente = null;
    }

    if (createIngresoDto.id_cxc) {
      const cuenta = await this.cuentaRepository.findOne({
        where: { id_cxc: createIngresoDto.id_cxc },
        relations: ['cliente'],
      });

      if (!cuenta) {
        throw new NotFoundException('Cuenta por cobrar no encontrada');
      }

      ingreso.cuentaPorCobrar = cuenta;

      if (!ingreso.cliente && cuenta.cliente) {
        ingreso.cliente = cuenta.cliente;
      }
    } else {
      ingreso.cuentaPorCobrar = null;
    }

    return await this.ingresoRepository.save(ingreso);
  }

  async findAll() {
    return await this.ingresoRepository.find({
      order: { id_movimiento: 'DESC' },
    });
  }

  async findOne(id: number) {
    const ingreso = await this.ingresoRepository.findOne({
      where: { id_movimiento: id },
    });

    if (!ingreso) {
      throw new NotFoundException('Ingreso no encontrado');
    }

    return ingreso;
  }

  async update(id: number, updateIngresoDto: UpdateIngresoDto) {
    const ingreso = await this.findOne(id);

    if (updateIngresoDto.fecha !== undefined) {
      ingreso.fecha = updateIngresoDto.fecha;
    }

    if (updateIngresoDto.concepto !== undefined) {
      ingreso.concepto = updateIngresoDto.concepto;
    }

    if (updateIngresoDto.monto !== undefined) {
      ingreso.monto = updateIngresoDto.monto;
    }

    if (updateIngresoDto.id_cliente !== undefined) {
      if (updateIngresoDto.id_cliente === null) {
        ingreso.cliente = null;
      } else {
        const cliente = await this.clienteRepository.findOne({
          where: { id_cliente: updateIngresoDto.id_cliente },
        });

        if (!cliente) {
          throw new NotFoundException('Cliente no encontrado');
        }

        ingreso.cliente = cliente;
      }
    }

    if (updateIngresoDto.id_cxc !== undefined) {
      if (updateIngresoDto.id_cxc === null) {
        ingreso.cuentaPorCobrar = null;
      } else {
        const cuenta = await this.cuentaRepository.findOne({
          where: { id_cxc: updateIngresoDto.id_cxc },
          relations: ['cliente'],
        });

        if (!cuenta) {
          throw new NotFoundException('Cuenta por cobrar no encontrada');
        }

        ingreso.cuentaPorCobrar = cuenta;

        if (!ingreso.cliente && cuenta.cliente) {
          ingreso.cliente = cuenta.cliente;
        }
      }
    }

    return await this.ingresoRepository.save(ingreso);
  }

  async remove(id: number) {
    const ingreso = await this.findOne(id);
    return await this.ingresoRepository.remove(ingreso);
  }

  async crearDesdeCuentaPagada(idCxc: number) {
    const cuenta = await this.cuentaRepository.findOne({
      where: { id_cxc: idCxc },
      relations: ['cliente'],
    });

    if (!cuenta) {
      throw new NotFoundException('Cuenta por cobrar no encontrada');
    }

    if (cuenta.estatus !== 'PAGADA') {
      throw new BadRequestException('La cuenta por cobrar no está pagada');
    }

    const ingresoExistente = await this.ingresoRepository.findOne({
      where: {
        cuentaPorCobrar: {
          id_cxc: idCxc,
        },
      },
    });

    if (ingresoExistente) {
      return ingresoExistente;
    }

    const ingreso = this.ingresoRepository.create({
      fecha: new Date().toISOString().split('T')[0],
      concepto: cuenta.descripcion || `Pago de cuenta por cobrar #${cuenta.id_cxc}`,
      monto: String(cuenta.monto),
      cliente: cuenta.cliente ?? null,
      cuentaPorCobrar: cuenta,
    });

    return await this.ingresoRepository.save(ingreso);
  }
}