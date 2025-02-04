import { LivingBeingModel } from '@/livingBeings/domain/models/livingBeings.model';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('livingBeings')
export class LivingBeing implements LivingBeingModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  name: string;

  @Column('varchar')
  scientific_name: string;

  @Column('varchar')
  location: string;

  @Column('varchar')
  size: string;

  @Column('int')
  life_expectancy: number;

  @Column('decimal')
  ph: number;

  @Column('int')
  temperature: number;

  @Column('varchar')
  description: string;

  @Column('uuid')
  water_type_id: string;

  @Column('uuid')
  category_id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
