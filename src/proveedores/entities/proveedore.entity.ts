import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('proveedores')
export class Proveedore {
  @PrimaryGeneratedColumn()
  id_proveedor: number;

  @Column({ length: 150 })
  nombre: string;

  @Column({ length: 30, nullable: true })
  telefono?: string;

  @Column({ length: 120, nullable: true })
  correo?: string;

  @Column({ type: 'text', nullable: true })
  direccion?: string;

  @Column({ length: 13, nullable: true })
  rfc?: string;
}