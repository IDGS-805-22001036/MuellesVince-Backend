import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CuentasPorPagar } from './entities/cuentas-por-pagar.entity';
import { CreateCuentasPorPagarDto } from './dto/create-cuentas-por-pagar.dto';
import { UpdateCuentasPorPagarDto } from './dto/update-cuentas-por-pagar.dto';
import { Proveedore } from '../proveedores/entities/proveedore.entity';
import { FormasPago } from '../formas-pago/entities/formas-pago.entity';
import { GastosService } from '../gastos/gastos.service';

const normalizarEstatus = (estatus?: string) => {
  if (!estatus) return estatus;

  const valor = estatus.trim().toLowerCase();

  if (valor === 'pagado' || valor === 'pagada') return 'PAGADA';
  if (valor === 'por pagar' || valor === 'pendiente') return 'PENDIENTE';

  return estatus.toUpperCase();
};

@Injectable()
export class CuentasPorPagarService {
  constructor(
    @InjectRepository(CuentasPorPagar)
    private readonly repo: Repository<CuentasPorPagar>,

    @InjectRepository(Proveedore)
    private readonly proveedorRepository: Repository<Proveedore>,

    @InjectRepository(FormasPago)
    private readonly formaPagoRepository: Repository<FormasPago>,

    private readonly gastosService: GastosService,
  ) {}

  async create(dto: CreateCuentasPorPagarDto) {
    const entity = this.repo.create({
      monto: dto.monto !== undefined ? Number(dto.monto).toFixed(2) : undefined,
      fecha_registro: dto.fecha_registro,
      fecha_vencimiento: dto.fecha_vencimiento,
      descripcion: dto.descripcion,
      estatus: normalizarEstatus(dto.estatus),
      proveedor: dto.id_proveedor
        ? ({ id_proveedor: dto.id_proveedor } as any)
        : undefined,
      formaPago: dto.forma_pago
        ? ({ id_forma_pago: dto.forma_pago } as any)
        : undefined,
    });

    const cuentaGuardada = await this.repo.save(entity);

    if (cuentaGuardada.estatus === 'PAGADA') {
      await this.gastosService.crearDesdeCuentaPagada(cuentaGuardada.id_cxp);
    }

    return cuentaGuardada;
  }

  findAll() {
  return this.repo.find({
    where: { estatus: 'PENDIENTE' },
    relations: { proveedor: true, formaPago: true },
    order: { id_cxp: 'ASC' },
  });
}

  async findOne(id: number) {
    const item = await this.repo.findOne({
      where: { id_cxp: id },
      relations: { proveedor: true, formaPago: true },
    });

    if (!item) {
      throw new NotFoundException('Cuenta por pagar no encontrada');
    }

    return item;
  }

  async update(id: number, dto: UpdateCuentasPorPagarDto) {
    const cuenta = await this.repo.findOne({
      where: { id_cxp: id },
      relations: { proveedor: true, formaPago: true },
    });

    if (!cuenta) {
      throw new NotFoundException('Cuenta por pagar no encontrada');
    }

    const estatusAnterior = normalizarEstatus(cuenta.estatus);

    if (dto.monto !== undefined) {
      cuenta.monto = Number(dto.monto).toFixed(2) as any;
    }

    if (dto.fecha_registro !== undefined) {
      cuenta.fecha_registro = dto.fecha_registro;
    }

    if (dto.fecha_vencimiento !== undefined) {
      cuenta.fecha_vencimiento = dto.fecha_vencimiento;
    }

    if (dto.descripcion !== undefined) {
      cuenta.descripcion = dto.descripcion;
    }

    if (dto.estatus !== undefined) {
      cuenta.estatus = normalizarEstatus(dto.estatus) || cuenta.estatus;
    }

    if (dto.id_proveedor !== undefined) {
      if (dto.id_proveedor === null) {
        cuenta.proveedor = undefined;
      } else {
        const proveedor = await this.proveedorRepository.findOne({
          where: { id_proveedor: dto.id_proveedor },
        });

        if (!proveedor) {
          throw new NotFoundException('Proveedor no encontrado');
        }

        cuenta.proveedor = proveedor;
      }
    }

    if (dto.forma_pago !== undefined) {
      if (dto.forma_pago === null) {
        cuenta.formaPago = undefined;
      } else {
        const formaPago = await this.formaPagoRepository.findOne({
          where: { id_forma_pago: dto.forma_pago },
        });

        if (!formaPago) {
          throw new NotFoundException('Forma de pago no encontrada');
        }

        cuenta.formaPago = formaPago;
      }
    }

    const cuentaActualizada = await this.repo.save(cuenta);

    if (
      estatusAnterior !== 'PAGADA' &&
      cuentaActualizada.estatus === 'PAGADA'
    ) {
      await this.gastosService.crearDesdeCuentaPagada(cuentaActualizada.id_cxp);
    }

    return cuentaActualizada;
  }

  async remove(id: number) {
    const res = await this.repo.delete({ id_cxp: id });

    if (!res.affected) {
      throw new NotFoundException('Cuenta por pagar no encontrada');
    }

    return { deleted: true };
  }
}