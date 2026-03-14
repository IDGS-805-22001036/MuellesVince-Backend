import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Cotizacione } from './cotizacione.entity';

@Entity('cotizacion_detalles')
export class CotizacionDetalle {
  @PrimaryGeneratedColumn({ name: 'id_detalle' })
  id_detalle: number;

  @ManyToOne(() => Cotizacione, (cotizacion) => cotizacion.detalles, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_cotizacion' })
  cotizacion: Cotizacione;

  @Column({ type: 'varchar', length: 250 })
  descripcion: string;

  @Column({ type: 'numeric', precision: 10, scale: 2, default: 1 })
  cantidad: number;

  @Column({ type: 'numeric', precision: 12, scale: 2, default: 0 })
  precio_unitario: number;

  @Column({ type: 'numeric', precision: 12, scale: 2, default: 0 })
  importe: number;
}