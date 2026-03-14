import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Proveedore } from '../../proveedores/entities/proveedore.entity';
import { CuentasPorPagar } from '../../cuentas-por-pagar/entities/cuentas-por-pagar.entity';

@Entity('gastos')
export class Gasto {
  @PrimaryGeneratedColumn()
  id_movimiento: number;

  @Column({ type: 'date', nullable: true })
  fecha: string;

  @Column({ length: 200, nullable: true })
  concepto: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  monto: string;

  @ManyToOne(() => Proveedore, { nullable: true, eager: true })
  @JoinColumn({ name: 'id_proveedor' })
  proveedor?: Proveedore | null;

  @ManyToOne(() => CuentasPorPagar, { nullable: true, eager: true })
  @JoinColumn({ name: 'id_cxp' })
  cuentaPorPagar?: CuentasPorPagar | null;
}