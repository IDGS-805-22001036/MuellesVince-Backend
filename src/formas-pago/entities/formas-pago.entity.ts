import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('formas_pago')
export class FormasPago {
  @PrimaryGeneratedColumn()
  id_forma_pago: number;

  @Column({ length: 50 })
  nombre: string;
}