import { randomUUID } from 'crypto';
import { InMemoryRepository } from './in-memory.repository';
import { NotFoundError } from '../errors/NotFoundError';
type StubModelProps = {
  id: string;
  name: string;
  scientific_name: string;
  location: string;
  size: string;
  life_expectancy;
  ph: number;
  temperature: number;
  description: string;
  water_type_id: string;
  category_id: string;
  created_at: Date;
  updated_at: Date;
};
class StubInMemoryRepository extends InMemoryRepository<StubModelProps> {
  constructor() {
    super();
    this.sortableFields = ['name'];
  }

  protected async applyFilter(
    items: StubModelProps[],
    filter: string | null,
  ): Promise<StubModelProps[]> {
    if (!filter) return items;
    return items.filter(item =>
      item.name.toLowerCase().includes(filter.toLowerCase()),
    );
  }
}
describe('InMemoryRepository unit tests', () => {
  let sut: StubInMemoryRepository;
  let model: StubModelProps;
  let props: any;
  let created_at: Date;
  let updated_at: Date;

  beforeEach(() => {
    sut = new StubInMemoryRepository();
    created_at = new Date();
    updated_at = new Date();
    props = {
      name: 'Lambari',
      scientific_name: 'Astyanax ribeirae',
      location: 'América do Sul',
      size: '5',
      life_expectancy: 5,
      ph: 6.4,
      temperature: 26,
      description:
        'O aquário deverá conter plantas formando zonas sombrias com algumas áreas abertas para natação. Outras peças de decoração poderão incluir troncos e raízes',
      water_type_id: 'c68687ed-4668-4109-b4e9-110aa4efeadb',
      category_id: '01a454b9-6d58-44a0-aa64-c7ba5d7df6a3',
    };
    model = {
      id: randomUUID(),
      created_at,
      updated_at,
      ...props,
    };
  });

  describe('create', () => {
    it('should create a new model', () => {
      const result = sut.create(props);
      expect(result.name).toStrictEqual('Lambari');
    });
  });

  describe('insert', () => {
    it('should inserts a new model', async () => {
      const result = await sut.insert(model);
      expect(result).toStrictEqual(sut.items[0]);
    });
  });

  describe('getById', () => {
    it('should throw error when id not found', async () => {
      await expect(sut.getById('fake_id')).rejects.toThrow(
        new NotFoundError('Model not found using ID fake_id'),
      );
      const id = randomUUID();
      await expect(sut.getById(id)).rejects.toThrow(
        new NotFoundError(`Model not found using ID ${id}`),
      );
    });

    it('should find a model by id', async () => {
      const data = await sut.insert(model);
      const result = await sut.getById(data.id);
      expect(result).toStrictEqual(data);
    });
  });

  describe('update', () => {
    it('should throw error when id not found', async () => {
      await expect(sut.update(model)).rejects.toThrow(
        new NotFoundError(`Model not found using ID ${model.id}`),
      );
    });

    it('should update an model', async () => {
      const data = await sut.insert(model);
      const modelUpdated = {
        id: data.id,
        name: 'editado Lambari',
        scientific_name: 'editado Astyanax ribeirae',
        location: 'editado América do Sul',
        size: '10',
        life_expectancy: 2,
        ph: 7.4,
        temperature: 268,
        description:
          'editado O aquário deverá conter plantas formando zonas sombrias com algumas áreas abertas para natação. Outras peças de decoração poderão incluir troncos e raízes',
        water_type_id: 'c68687ed-4668-4109-b4e9-110aa4efeadb',
        category_id: '01a454b9-6d58-44a0-aa64-c7ba5d7df6a3',
        created_at,
        updated_at,
      };
      const result = await sut.update(modelUpdated);
      expect(result).toStrictEqual(sut.items[0]);
    });
  });

  describe('applyFilter', () => {
    it('should no filter items when filter param is null', async () => {
      const items = [model];
      const spyFilterMethod = jest.spyOn(items, 'filter' as any);
      const result = await sut['applyFilter'](items, null);
      expect(spyFilterMethod).not.toHaveBeenCalled();
      expect(result).toStrictEqual(items);
    });
    it('should filter the data using filter param', async () => {
      const items = [
        {
          id: 'c68687ed-4668-4109-b4e9-110aa4efeadb',
          name: 'lambari',
          scientific_name: 'Astyanax ribeirae',
          location: 'América do Sul',
          size: '7',
          life_expectancy: 6,
          ph: 7.4,
          temperature: 24,
          description:
            'O aquário deverá conter plantas formando zonas sombrias com algumas áreas abertas para natação. Outras peças de decoração poderão incluir troncos e raízes',
          water_type_id: 'c68687ed-4668-4109-b4e9-110aa4efecdb',
          category_id: '01a454b9-6d58-44a0-aa64-c7ba5d7df2a3',
          created_at,
          updated_at,
        },
        {
          id: 'c68687ed-4668-4109-b4e9-110aa4efeadb',
          name: 'LAMBARI',
          scientific_name: 'Astyanax ribeirae',
          location: 'América do Sul',
          size: '7',
          life_expectancy: 6,
          ph: 7.4,
          temperature: 24,
          description:
            'O aquário deverá conter plantas formando zonas sombrias com algumas áreas abertas para natação. Outras peças de decoração poderão incluir troncos e raízes',
          water_type_id: 'c68687ed-4668-4109-b4e9-110aa4efecdb',
          category_id: '01a454b9-6d58-44a0-aa64-c7ba5d7df2a3',
          created_at,
          updated_at,
        },
        {
          id: randomUUID(),
          name: 'fake',
          scientific_name: 'fake',
          location: 'fake',
          size: '2',
          life_expectancy: 1,
          ph: 2,
          temperature: 2,
          description: 'fake',
          water_type_id: 'c68687ed-4668-4109-b4e9-110aa4efebdb',
          category_id: '01a454b9-6d58-44a0-aa64-c7ba5d7df4a3',
          created_at,
          updated_at,
        },
      ];
      const spyFilterMethod = jest.spyOn(items, 'filter' as any);
      let result = await sut['applyFilter'](items, 'LAMBARI');
      expect(spyFilterMethod).toHaveBeenCalledTimes(1);
      expect(result).toStrictEqual([items[0], items[1]]);

      result = await sut['applyFilter'](items, 'lambari');
      expect(spyFilterMethod).toHaveBeenCalledTimes(2);
      expect(result).toStrictEqual([items[0], items[1]]);

      result = await sut['applyFilter'](items, 'no-filter');
      expect(spyFilterMethod).toHaveBeenCalledTimes(3);
      expect(result).toHaveLength(0);
    });
  });

  describe('applySort', () => {
    it('should not sort items', async () => {
      const items = [
        {
          id: 'c68687ed-4668-4109-b4e9-110aa4efeadb',
          name: 'lambari',
          scientific_name: 'Astyanax ribeirae',
          location: 'América do Sul',
          size: '7',
          life_expectancy: 6,
          ph: 7.4,
          temperature: 24,
          description:
            'O aquário deverá conter plantas formando zonas sombrias com algumas áreas abertas para natação. Outras peças de decoração poderão incluir troncos e raízes',
          water_type_id: 'c68687ed-4668-4109-b4e9-110aa4efecdb',
          category_id: '01a454b9-6d58-44a0-aa64-c7ba5d7df2a3',
          created_at,
          updated_at,
        },
        {
          id: 'c68687ed-4668-4109-b4e9-110aa4efeadb',
          name: 'LAMBARI',
          scientific_name: 'Astyanax ribeirae',
          location: 'América do Sul',
          size: '7',
          life_expectancy: 6,
          ph: 7.4,
          temperature: 24,
          description:
            'O aquário deverá conter plantas formando zonas sombrias com algumas áreas abertas para natação. Outras peças de decoração poderão incluir troncos e raízes',
          water_type_id: 'c68687ed-4668-4109-b4e9-110aa4efecdb',
          category_id: '01a454b9-6d58-44a0-aa64-c7ba5d7df2a3',
          created_at,
          updated_at,
        },
        {
          id: randomUUID(),
          name: 'fake',
          scientific_name: 'fake',
          location: 'fake',
          size: '2',
          life_expectancy: 1,
          ph: 2,
          temperature: 2,
          description: 'fake',
          water_type_id: 'c68687ed-4668-4109-b4e9-110aa4efebdb',
          category_id: '01a454b9-6d58-44a0-aa64-c7ba5d7df4a3',
          created_at,
          updated_at,
        },
      ];
      let result = await sut['applySort'](items, null, null);
      expect(result).toStrictEqual(items);
      result = await sut['applySort'](items, 'id', 'asc');
      expect(result).toStrictEqual(items);
    });
    it('should sort items', async () => {
      const items = [
        {
          id: randomUUID(),
          name: '1',
          scientific_name: '1',
          location: '1',
          size: '1',
          life_expectancy: 1,
          ph: 1,
          temperature: 1,
          description: '1',
          water_type_id: 'c68687ed-4668-4109-b4e9-110aa4efecdb',
          category_id: '01a454b9-6d58-44a0-aa64-c7ba5d7df2a3',
          created_at,
          updated_at,
        },
        {
          id: randomUUID(),
          name: '2',
          scientific_name: '2',
          location: '2',
          size: '2',
          life_expectancy: 2,
          ph: 2,
          temperature: 2,
          description: '2',
          water_type_id: 'c68687ed-4668-4109-b4e9-110aa4efecdb',
          category_id: '01a454b9-6d58-44a0-aa64-c7ba5d7df2a3',
          created_at,
          updated_at,
        },
        {
          id: randomUUID(),
          name: '3',
          scientific_name: '3',
          location: '3',
          size: '3',
          life_expectancy: 3,
          ph: 3,
          temperature: 3,
          description: '3',
          water_type_id: 'c68687ed-4668-4109-b4e9-110aa4efebdb',
          category_id: '01a454b9-6d58-44a0-aa64-c7ba5d7df4a3',
          created_at,
          updated_at,
        },
      ];
      let result = await sut['applySort'](items, 'name', 'desc');
      expect(result).toStrictEqual([items[2], items[1], items[0]]);
      result = await sut['applySort'](items, 'name', 'asc');
      expect(result).toStrictEqual([items[0], items[1], items[2]]);
    });
  });

  describe('applyPaginate', () => {
    it('should paginate items', async () => {
      const items = [
        {
          id: randomUUID(),
          name: '1',
          scientific_name: '1',
          location: '1',
          size: '1',
          life_expectancy: 1,
          ph: 1,
          temperature: 1,
          description: '1',
          water_type_id: 'c68687ed-4668-4109-b4e9-110aa4efecdb',
          category_id: '01a454b9-6d58-44a0-aa64-c7ba5d7df2a3',
          created_at,
          updated_at,
        },
        {
          id: randomUUID(),
          name: '2',
          scientific_name: '2',
          location: '2',
          size: '2',
          life_expectancy: 2,
          ph: 2,
          temperature: 2,
          description: '2',
          water_type_id: 'c68687ed-4668-4109-b4e9-110aa4efecdb',
          category_id: '01a454b9-6d58-44a0-aa64-c7ba5d7df2a3',
          created_at,
          updated_at,
        },
        {
          id: randomUUID(),
          name: '3',
          scientific_name: '3',
          location: '3',
          size: '3',
          life_expectancy: 3,
          ph: 3,
          temperature: 3,
          description: '3',
          water_type_id: 'c68687ed-4668-4109-b4e9-110aa4efebdb',
          category_id: '01a454b9-6d58-44a0-aa64-c7ba5d7df4a3',
          created_at,
          updated_at,
        },
        {
          id: randomUUID(),
          name: '4',
          scientific_name: '4',
          location: '4',
          size: '4',
          life_expectancy: 4,
          ph: 4,
          temperature: 4,
          description: '4',
          water_type_id: 'c68687ed-4668-4109-b4e9-110aa4efebdb',
          category_id: '01a454b9-6d58-44a0-aa64-c7ba5d7df4a3',
          created_at,
          updated_at,
        },
      ];
      let result = await sut['applyPaginate'](items, 1, 2);
      expect(result).toStrictEqual([items[0], items[1]]);
      result = await sut['applyPaginate'](items, 2, 2);
      expect(result).toStrictEqual([items[2], items[3]]);
      result = await sut['applyPaginate'](items, 2, 3);
    });
  });

  describe('search', () => {
    it('should paginate items', async () => {
      const items = Array(16).fill(model);
      sut.items = items;
      const result = await sut.get({});
      expect(result).toStrictEqual({
        items: Array(15).fill(model),
        total: 16,
        current_page: 1,
        per_page: 15,
        sort: null,
        sort_dir: null,
        filter: null,
      });
    });
    it('should apply paginate and filter', async () => {
      const items = [
        {
          id: randomUUID(),
          name: '1',
          scientific_name: '1',
          location: '1',
          size: '1',
          life_expectancy: 1,
          ph: 1,
          temperature: 1,
          description: '1',
          water_type_id: 'c68687ed-4668-4109-b4e9-110aa4efecdb',
          category_id: '01a454b9-6d58-44a0-aa64-c7ba5d7df2a3',
          created_at,
          updated_at,
        },
        {
          id: randomUUID(),
          name: '2',
          scientific_name: '2',
          location: '2',
          size: '2',
          life_expectancy: 2,
          ph: 2,
          temperature: 2,
          description: '2',
          water_type_id: 'c68687ed-4668-4109-b4e9-110aa4efecdb',
          category_id: '01a454b9-6d58-44a0-aa64-c7ba5d7df2a3',
          created_at,
          updated_at,
        },
        {
          id: randomUUID(),
          name: '3',
          scientific_name: '3',
          location: '3',
          size: '3',
          life_expectancy: 3,
          ph: 3,
          temperature: 3,
          description: '3',
          water_type_id: 'c68687ed-4668-4109-b4e9-110aa4efebdb',
          category_id: '01a454b9-6d58-44a0-aa64-c7ba5d7df4a3',
          created_at,
          updated_at,
        },
        {
          id: randomUUID(),
          name: '4',
          scientific_name: '4',
          location: '4',
          size: '4',
          life_expectancy: 4,
          ph: 4,
          temperature: 4,
          description: '4',
          water_type_id: 'c68687ed-4668-4109-b4e9-110aa4efebdb',
          category_id: '01a454b9-6d58-44a0-aa64-c7ba5d7df4a3',
          created_at,
          updated_at,
        },
      ];
      sut.items = items;
      const result = await sut.get({
        page: 1,
        per_page: 2,
        filter: '1',
      });
      expect(result).toStrictEqual({
        items: [items[0]],
        total: 1,
        current_page: 1,
        per_page: 2,
        sort: null,
        sort_dir: null,
        filter: '1',
      });
    });
  });

  it('should apply paginate and sort', async () => {
    const items = [
      {
        id: randomUUID(),
        name: '2',
        scientific_name: '2',
        location: '2',
        size: '2',
        life_expectancy: 2,
        ph: 2,
        temperature: 2,
        description: '2',
        water_type_id: 'c68687ed-4668-4109-b4e9-110aa4efecdb',
        category_id: '01a454b9-6d58-44a0-aa64-c7ba5d7df2a3',
        created_at,
        updated_at,
      },
      {
        id: randomUUID(),
        name: '1',
        scientific_name: '1',
        location: '1',
        size: '1',
        life_expectancy: 1,
        ph: 1,
        temperature: 1,
        description: '1',
        water_type_id: 'c68687ed-4668-4109-b4e9-110aa4efecdb',
        category_id: '01a454b9-6d58-44a0-aa64-c7ba5d7df2a3',
        created_at,
        updated_at,
      },
      {
        id: randomUUID(),
        name: '4',
        scientific_name: '4',
        location: '4',
        size: '4',
        life_expectancy: 4,
        ph: 4,
        temperature: 4,
        description: '4',
        water_type_id: 'c68687ed-4668-4109-b4e9-110aa4efebdb',
        category_id: '01a454b9-6d58-44a0-aa64-c7ba5d7df4a3',
        created_at,
        updated_at,
      },
      {
        id: randomUUID(),
        name: '3',
        scientific_name: '3',
        location: '3',
        size: '3',
        life_expectancy: 3,
        ph: 3,
        temperature: 3,
        description: '3',
        water_type_id: 'c68687ed-4668-4109-b4e9-110aa4efebdb',
        category_id: '01a454b9-6d58-44a0-aa64-c7ba5d7df4a3',
        created_at,
        updated_at,
      },
    ];
    sut.items = items;
    let result = await sut.get({
      page: 1,
      per_page: 2,
      sort: 'name',
      sort_dir: 'asc',
    });
    expect(result).toStrictEqual({
      items: [items[1], items[0]],
      total: 4,
      current_page: 1,
      per_page: 2,
      sort: 'name',
      sort_dir: 'asc',
      filter: null,
    });
    result = await sut.get({
      page: 2,
      per_page: 2,
      sort: 'name',
      sort_dir: 'asc',
    });
    expect(result).toStrictEqual({
      items: [items[3], items[2]],
      total: 4,
      current_page: 2,
      per_page: 2,
      sort: 'name',
      sort_dir: 'asc',
      filter: null,
    });
  });

  it('should search using filter, sort and paginate', async () => {
    const items = [
      {
        id: randomUUID(),
        name: '2',
        scientific_name: '2',
        location: '2',
        size: '2',
        life_expectancy: 2,
        ph: 2,
        temperature: 2,
        description: '2',
        water_type_id: 'c68687ed-4668-4109-b4e9-110aa4efecdb',
        category_id: '01a454b9-6d58-44a0-aa64-c7ba5d7df2a3',
        created_at,
        updated_at,
      },
      {
        id: randomUUID(),
        name: '1',
        scientific_name: '1',
        location: '1',
        size: '1',
        life_expectancy: 1,
        ph: 1,
        temperature: 1,
        description: '1',
        water_type_id: 'c68687ed-4668-4109-b4e9-110aa4efecdb',
        category_id: '01a454b9-6d58-44a0-aa64-c7ba5d7df2a3',
        created_at,
        updated_at,
      },
      {
        id: randomUUID(),
        name: '4',
        scientific_name: '4',
        location: '4',
        size: '4',
        life_expectancy: 4,
        ph: 4,
        temperature: 4,
        description: '4',
        water_type_id: 'c68687ed-4668-4109-b4e9-110aa4efebdb',
        category_id: '01a454b9-6d58-44a0-aa64-c7ba5d7df4a3',
        created_at,
        updated_at,
      },
      {
        id: randomUUID(),
        name: '3',
        scientific_name: '3',
        location: '3',
        size: '3',
        life_expectancy: 3,
        ph: 3,
        temperature: 3,
        description: '3',
        water_type_id: 'c68687ed-4668-4109-b4e9-110aa4efebdb',
        category_id: '01a454b9-6d58-44a0-aa64-c7ba5d7df4a3',
        created_at,
        updated_at,
      },
      {
        id: randomUUID(),
        name: '1',
        scientific_name: '1',
        location: '1',
        size: '1',
        life_expectancy: 1,
        ph: 1,
        temperature: 1,
        description: '1',
        water_type_id: 'c68687ed-4668-4109-b4e9-110aa4efecdb',
        category_id: '01a454b9-6d58-44a0-aa64-c7ba5d7df2a3',
        created_at,
        updated_at,
      },
      {
        id: randomUUID(),
        name: '4',
        scientific_name: '4',
        location: '4',
        size: '4',
        life_expectancy: 4,
        ph: 4,
        temperature: 4,
        description: '4',
        water_type_id: 'c68687ed-4668-4109-b4e9-110aa4efebdb',
        category_id: '01a454b9-6d58-44a0-aa64-c7ba5d7df4a3',
        created_at,
        updated_at,
      },
    ];
    sut.items = items;
    let result = await sut.get({
      page: 1,
      per_page: 2,
      sort: 'name',
      sort_dir: 'asc',
      filter: '1',
    });
    expect(result).toStrictEqual({
      items: [items[1], items[4]],
      total: 2,
      current_page: 1,
      per_page: 2,
      sort: 'name',
      sort_dir: 'asc',
      filter: '1',
    });
    result = await sut.get({
      page: 1,
      per_page: 2,
      sort: 'name',
      sort_dir: 'desc',
      filter: '4',
    });
    expect(result).toStrictEqual({
      items: [items[2], items[5]],
      total: 2,
      current_page: 1,
      per_page: 2,
      sort: 'name',
      sort_dir: 'desc',
      filter: '4',
    });
  });
});
