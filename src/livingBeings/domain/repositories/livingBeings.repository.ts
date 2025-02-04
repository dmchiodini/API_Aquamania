import { LivingBeingModel } from '../models/livingBeings.model';
import { RepositoryInterface } from './../../../common/domain/repositories/repository.interface';

export type CreateLivingBeingProps = {
  id: string;
  name: string;
  scientific_name: string;
  location: string;
  size: string;
  life_expectancy: number;
  ph: number;
  temperature: number;
  description: string;
  water_type_id: string;
  category_id: string;
  created_at: Date;
  updated_at: Date;
};

export interface LivingBeingsRepository
  extends RepositoryInterface<LivingBeingModel, CreateLivingBeingProps> {
  getByName(name: string): Promise<LivingBeingModel>;
  getById(id: string): Promise<LivingBeingModel>;
  conflictingName(name: string): Promise<void>;
}
