import { randomUUID } from 'node:crypto';
import { NotFoundError } from '../errors/notFoundError';
import {
  RepositoryInterface,
  SearchInput,
  SearchOutput,
} from './repository.interface';

export type ModelProps = {
  id?: string;
  [key: string]: any;
};

export type CreateProps = {
  [key: string]: any;
};

export abstract class InMemoryRepository<Model extends ModelProps>
  implements RepositoryInterface<Model, CreateProps>
{
  data: Model[] = [];
  sortableFields: string[] = [];

  create(props: CreateProps): Model {
    const model = {
      id: randomUUID(),
      created_at: new Date(),
      updated_at: new Date(),
      ...props,
    };

    return model as unknown as Model;
  }

  async insert(model: Model): Promise<Model> {
    await this.data.push(model);

    return model;
  }

  async get(props: SearchInput): Promise<SearchOutput<Model>> {
    const page = props.page ?? 1;
    const per_page = props.per_page ?? 15;
    const sort = props.sort ?? null;
    const sort_dir = props.sort_dir ?? null;
    const filter = props.filter ?? null;

    const filteredItems = await this.ApplyFilter(this.data, filter);
    const orderedItems = await this.ApplySort(filteredItems, sort, sort_dir);
    const paginatedItems = await this.ApplyPaginate(
      orderedItems,
      page,
      per_page,
    );

    return {
      data: paginatedItems,
      total: filteredItems.length,
      current_page: page,
      per_page,
      sort,
      sort_dir,
      filter,
    };
  }

  protected abstract ApplyFilter(
    items: Model[],
    filter: string | null,
  ): Promise<Model[]>;

  protected async ApplySort(
    data: Model[],
    sort: string | null,
    sort_dir: string | null,
  ): Promise<Model[]> {
    if (!sort || !this.sortableFields.includes(sort)) {
      return data;
    }

    return [...data].sort((a, b) => {
      if (a[sort] < b[sort]) {
        return sort_dir === 'asc' ? -1 : 1;
      }
      if (a[sort] > b[sort]) {
        return sort_dir === 'asc' ? 1 : -1;
      }

      return 0;
    });
  }

  protected async ApplyPaginate(
    data: Model[],
    page: number,
    per_page: number,
  ): Promise<Model[]> {
    const start = (page - 1) * per_page;
    const limit = start + per_page;
    return data.slice(start, limit);
  }

  async getById(id: string): Promise<Model> {
    return this._get(id);
  }

  async updated(model: Model): Promise<Model> {
    await this._get(model.id);
    const index = this.data.findIndex(item => item.id === model.id);
    this.data[index] = model;
    return model;
  }

  async delete(id: string): Promise<Model> {
    const model = await this._get(id);
    const index = this.data.findIndex(item => item.id === id);
    this.data.splice(index, 1);

    return model;
  }

  protected async _get(id: string): Promise<Model> {
    const model = this.data.find(item => item.id === id);

    if (!model) {
      throw new NotFoundError(`Model not found using ID ${id}`);
    }

    return model;
  }
}
