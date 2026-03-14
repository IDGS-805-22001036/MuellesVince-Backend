import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CotizacionDetalle } from './cotizacion-detalle.entity';

@Entity('cotizaciones')
export class Cotizacione {
  @PrimaryGeneratedColumn({ name: 'id_cotizacion' })
  id_cotizacion: number;

  @Column({ type: 'varchar', length: 30, unique: true })
  folio: string;

  @Column({ type: 'varchar', length: 150 })
  nombre_cliente: string;

  @Column({ type: 'varchar', length: 30, nullable: true })
  telefono?: string;

  @Column({ type: 'varchar', length: 120, nullable: true })
  correo?: string;

  @Column({ type: 'text', nullable: true })
  direccion?: string;

  @Column({ type: 'varchar', length: 13, nullable: true })
  rfc?: string;

  @Column({ type: 'date' })
  fecha: string;

  @Column({ type: 'text', nullable: true })
  notas?: string;

  @Column({ type: 'numeric', precision: 12, scale: 2, default: 0 })
  subtotal: number;

  @Column({ type: 'numeric', precision: 12, scale: 2, default: 0 })
  iva: number;

  @Column({ type: 'numeric', precision: 12, scale: 2, default: 0 })
  total: number;

  @OneToMany(() => CotizacionDetalle, (detalle) => detalle.cotizacion, {
    cascade: true,
    eager: true,
  })
  detalles: CotizacionDetalle[];
}