import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Cliente } from '../../clientes/entities/cliente.entity';
import { CuentasPorCobrar } from '../../cuentas-por-cobrar/entities/cuentas-por-cobrar.entity';

@Entity('ingresos')
export class Ingreso {
  @PrimaryGeneratedColumn()
  id_movimiento: number;

  @Column({ type: 'date', nullable: true })
  fecha: string;

  @Column({ length: 200, nullable: true })
  concepto: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  monto: string;

  @ManyToOne(() => Cliente, { nullable: true, eager: true })
  @JoinColumn({ name: 'id_cliente' })
  cliente?: Cliente | null;

  @ManyToOne(() => CuentasPorCobrar, { nullable: true, eager: true })
  @JoinColumn({ name: 'id_cxc' })
  cuentaPorCobrar?: CuentasPorCobrar | null;
}