import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IngresosService } from '../ingresos/ingresos.service';
import { CreateCuentasPorCobrarDto } from './dto/create-cuentas-por-cobrar.dto';
import { UpdateCuentasPorCobrarDto } from './dto/update-cuentas-por-cobrar.dto';
import { CuentasPorCobrar } from './entities/cuentas-por-cobrar.entity';
import { Cliente } from 'src/clientes/entities/cliente.entity';
import { FormasPago } from 'src/formas-pago/entities/formas-pago.entity';

@Injectable()
export class CuentasPorCobrarService {
  constructor(
    @InjectRepository(CuentasPorCobrar)
    private readonly repo: Repository<CuentasPorCobrar>,

    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,

    @InjectRepository(FormasPago)
    private readonly formaPagoRepository: Repository<FormasPago>,

    private readonly ingresosService: IngresosService,
  ) {}

  create(dto: CreateCuentasPorCobrarDto) {
    const entity = this.repo.create({
      monto: dto.monto !== undefined ? Number(dto.monto).toFixed(2) : undefined,
      fecha_registro: dto.fecha_registro,
      fecha_vencimiento: dto.fecha_vencimiento,
      descripcion: dto.descripcion,
      estatus: dto.estatus,
      cliente: dto.id_cliente ? ({ id_cliente: dto.id_cliente } as any) : null,
      formaPago: dto.forma_pago ? ({ id_forma_pago: dto.forma_pago } as any) : null,
    });

    return this.repo.save(entity);
  }

  findAll() {
    return this.repo.find({
      relations: { cliente: true, formaPago: true },
      order: { id_cxc: 'ASC' },
    });
  }

  async findOne(id: number) {
    const item = await this.repo.findOne({
      where: { id_cxc: id },
      relations: { cliente: true, formaPago: true },
    });

    if (!item) {
      throw new NotFoundException('Cuenta por cobrar no encontrada');
    }

    return item;
  }

  async update(id: number, dto: UpdateCuentasPorCobrarDto) {
    const cuenta = await this.repo.findOne({
      where: { id_cxc: id },
      relations: { cliente: true, formaPago: true },
    });

    if (!cuenta) {
      throw new NotFoundException('Cuenta por cobrar no encontrada');
    }

    const estatusAnterior = cuenta.estatus;

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
      cuenta.estatus = dto.estatus;
    }

    if (dto.id_cliente !== undefined) {
      if (dto.id_cliente === null) {
        cuenta.cliente = undefined;
      } else {
        const cliente = await this.clienteRepository.findOne({
          where: { id_cliente: dto.id_cliente },
        });

        if (!cliente) {
          throw new NotFoundException('Cliente no encontrado');
        }

        cuenta.cliente = cliente;
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
      await this.ingresosService.crearDesdeCuentaPagada(cuentaActualizada.id_cxc);
    }

    return cuentaActualizada;
  }

  async remove(id: number) {
    const res = await this.repo.delete({ id_cxc: id });

    if (!res.affected) {
      throw new NotFoundException('Cuenta por cobrar no encontrada');
    }

    return { deleted: true };
  }
}