import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Gasto } from './entities/gasto.entity';
import { Proveedore } from '../proveedores/entities/proveedore.entity';
import { CuentasPorPagar } from '../cuentas-por-pagar/entities/cuentas-por-pagar.entity';
import { CreateGastoDto } from './dto/create-gasto.dto';
import { UpdateGastoDto } from './dto/update-gasto.dto';

@Injectable()
export class GastosService {
  constructor(
    @InjectRepository(Gasto)
    private readonly gastoRepository: Repository<Gasto>,

    @InjectRepository(Proveedore)
    private readonly proveedorRepository: Repository<Proveedore>,

    @InjectRepository(CuentasPorPagar)
    private readonly cuentaRepository: Repository<CuentasPorPagar>,
  ) {}

  

  async create(createGastoDto: CreateGastoDto) {
    const gasto = new Gasto();
    gasto.fecha = createGastoDto.fecha;
    gasto.concepto = createGastoDto.concepto;
    gasto.monto = createGastoDto.monto;

    if (createGastoDto.id_proveedor) {
      const proveedor = await this.proveedorRepository.findOne({
        where: { id_proveedor: createGastoDto.id_proveedor },
      });

      if (!proveedor) {
        throw new NotFoundException('Proveedor no encontrado');
      }

      gasto.proveedor = proveedor;
    } else {
      gasto.proveedor = null;
    }

    if (createGastoDto.id_cxp) {
      const cuenta = await this.cuentaRepository.findOne({
        where: { id_cxp: createGastoDto.id_cxp },
        relations: ['proveedor'],
      });

      if (!cuenta) {
        throw new NotFoundException('Cuenta por pagar no encontrada');
      }

      gasto.cuentaPorPagar = cuenta;

      if (!gasto.proveedor && cuenta.proveedor) {
        gasto.proveedor = cuenta.proveedor;
      }
    } else {
      gasto.cuentaPorPagar = null;
    }

    return await this.gastoRepository.save(gasto);
  }

  async findAll() {
    return await this.gastoRepository.find({
      order: { id_movimiento: 'DESC' },
    });
  }

  async findOne(id: number) {
    const gasto = await this.gastoRepository.findOne({
      where: { id_movimiento: id },
    });

    if (!gasto) {
      throw new NotFoundException('Gasto no encontrado');
    }

    return gasto;
  }

  async update(id: number, updateGastoDto: UpdateGastoDto) {
    const gasto = await this.findOne(id);

    if (updateGastoDto.fecha !== undefined) {
      gasto.fecha = updateGastoDto.fecha;
    }

    if (updateGastoDto.concepto !== undefined) {
      gasto.concepto = updateGastoDto.concepto;
    }

    if (updateGastoDto.monto !== undefined) {
      gasto.monto = updateGastoDto.monto;
    }

    if (updateGastoDto.id_proveedor !== undefined) {
      if (updateGastoDto.id_proveedor === null) {
        gasto.proveedor = null;
      } else {
        const proveedor = await this.proveedorRepository.findOne({
          where: { id_proveedor: updateGastoDto.id_proveedor },
        });

        if (!proveedor) {
          throw new NotFoundException('Proveedor no encontrado');
        }

        gasto.proveedor = proveedor;
      }
    }

    if (updateGastoDto.id_cxp !== undefined) {
      if (updateGastoDto.id_cxp === null) {
        gasto.cuentaPorPagar = null;
      } else {
        const cuenta = await this.cuentaRepository.findOne({
          where: { id_cxp: updateGastoDto.id_cxp },
          relations: ['proveedor'],
        });

        if (!cuenta) {
          throw new NotFoundException('Cuenta por pagar no encontrada');
        }

        gasto.cuentaPorPagar = cuenta;

        if (!gasto.proveedor && cuenta.proveedor) {
          gasto.proveedor = cuenta.proveedor;
        }
      }
    }

    return await this.gastoRepository.save(gasto);
  }

  async remove(id: number) {
    const gasto = await this.findOne(id);
    return await this.gastoRepository.remove(gasto);
  }

  async crearDesdeCuentaPagada(idCxp: number) {
    const cuenta = await this.cuentaRepository.findOne({
      where: { id_cxp: idCxp },
      relations: ['proveedor'],
    });

    if (!cuenta) {
      throw new NotFoundException('Cuenta por pagar no encontrada');
    }

    if (cuenta.estatus !== 'PAGADA') {
      throw new BadRequestException('La cuenta por pagar no está pagada');
    }

    const gastoExistente = await this.gastoRepository.findOne({
      where: {
        cuentaPorPagar: {
          id_cxp: idCxp,
        },
      },
    });

    if (gastoExistente) {
      return gastoExistente;
    }

    const gasto = this.gastoRepository.create({
      fecha: new Date().toISOString().split('T')[0],
      concepto: cuenta.descripcion || `Pago de cuenta por pagar #${cuenta.id_cxp}`,
      monto: String(cuenta.monto),
      proveedor: cuenta.proveedor ?? null,
      cuentaPorPagar: cuenta,
    });

    

    return await this.gastoRepository.save(gasto);
  }
}