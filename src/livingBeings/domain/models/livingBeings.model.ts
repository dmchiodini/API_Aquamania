export interface LivingBeingModel {
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
}
