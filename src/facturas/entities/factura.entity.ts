import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('facturas')
export class Factura {
  @PrimaryGeneratedColumn({ name: 'id_factura' })
  id_factura: number;

  @Column({ type: 'varchar', length: 20 })
  tipo: string;

  @Column({ type: 'text', name: 'nombre_pdf' })
  nombre_pdf: string;

  @Column({ type: 'text', name: 'mime_type', default: 'application/pdf' })
  mime_type: string;

  @Column({ type: 'bytea', name: 'pdf_data' })
  pdf_data: Buffer;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  fecha: Date;
}