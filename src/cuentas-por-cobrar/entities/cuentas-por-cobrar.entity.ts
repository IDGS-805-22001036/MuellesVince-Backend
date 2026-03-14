import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Cliente } from '../../clientes/entities/cliente.entity';
import { FormasPago } from 'src/formas-pago/entities/formas-pago.entity';


@Entity('cuentas_por_cobrar')
export class CuentasPorCobrar {
  @PrimaryGeneratedColumn()
  id_cxc: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  monto: string;

  @Column({ type: 'date', nullable: true })
  fecha_registro: string;

  @Column({ type: 'date', nullable: true })
  fecha_vencimiento: string;

  @Column({ type: 'text', nullable: true })
  descripcion?: string;

  @Column({ length: 20, nullable: true })
  estatus?: string;

  @ManyToOne(() => Cliente, { nullable: true })
  @JoinColumn({ name: 'id_cliente' })
  cliente?: Cliente;

  @ManyToOne(() => FormasPago, { nullable: true })
  @JoinColumn({ name: 'forma_pago' })
  formaPago?: FormasPago;
}