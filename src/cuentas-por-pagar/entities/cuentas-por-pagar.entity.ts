import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Proveedore } from '../../proveedores/entities/proveedore.entity';
import { FormasPago } from '../../formas-pago/entities/formas-pago.entity';

@Entity('cuentas_por_pagar')
export class CuentasPorPagar {
  @PrimaryGeneratedColumn()
  id_cxp: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  monto: string;

  @Column({ type: 'date', nullable: true })
  fecha_registro: string;

  @Column({ type: 'date', nullable: true })
  fecha_vencimiento: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ length: 20, nullable: true })
  estatus: string;

  @ManyToOne(() => Proveedore, { nullable: true, eager: true })
  @JoinColumn({ name: 'id_proveedor' })
  proveedor?: Proveedore | null;

  @ManyToOne(() => FormasPago, { nullable: true, eager: true })
  @JoinColumn({ name: 'forma_pago' })
  formaPago?: FormasPago | null;
}