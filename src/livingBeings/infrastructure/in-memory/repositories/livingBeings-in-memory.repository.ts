import { ConflictError } from '@/common/domain/errors/ConflictError';
import { NotFoundError } from '@/common/domain/errors/NotFoundError';
import { InMemoryRepository } from '@/common/domain/repositories/in-memory.repository';
import { LivingBeingModel } from '@/livingBeings/domain/models/livingBeings.model';
import { LivingBeingsRepository } from '@/livingBeings/domain/repositories/livingBeings.repository';

export class LivingBeingInMemoryRepository
  extends InMemoryRepository<LivingBeingModel>
  implements LivingBeingsRepository
{
  sortableFields: string[] = ['name', 'created_at'];

  async getByName(name: string): Promise<LivingBeingModel> {
    const model = this.items.find(item => item.name === name);

    if (!model) {
      throw new NotFoundError(`Living being not found using name ${name}`);
    }

    return model;
  }

  async conflictingName(name: string): Promise<void> {
    const nameExists = this.getByName(name);

    if (nameExists) {
      throw new ConflictError(
        `There is already a living being with the name ${name}`,
      );
    }
  }

  protected async applyFilter(
    items: LivingBeingModel[],
    filter: string | null,
  ): Promise<LivingBeingModel[]> {
    if (!filter) {
      return items;
    }

    return items.filter(item =>
      item.name.toLowerCase().includes(filter.toLowerCase()),
    );
  }

  protected async applySort(
    items: LivingBeingModel[],
    sort: string | null,
    sort_dir: string | null,
  ): Promise<LivingBeingModel[]> {
    return super.applySort(items, sort ?? 'created_at', sort_dir ?? 'desc');
  }
}
