import { getRepository, Repository, In } from 'typeorm';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICreateProductDTO from '@modules/products/dtos/ICreateProductDTO';
import IUpdateProductsQuantityDTO from '@modules/products/dtos/IUpdateProductsQuantityDTO';
import Product from '../entities/Product';

interface IFindProducts {
  id: string;
}

class ProductsRepository implements IProductsRepository {
  private ormRepository: Repository<Product>;

  constructor() {
    this.ormRepository = getRepository(Product);
  }

  public async create({
    name,
    price,
    quantity,
  }: ICreateProductDTO): Promise<Product> {
    const product = this.ormRepository.create({
      name,
      price,
      quantity,
    });

    await this.ormRepository.save(product);

    return product;
  }

  public async findByName(name: string): Promise<Product | undefined> {
    const product = await this.ormRepository.findOne({
      where: { name },
    });

    return product;
  }

  public async findAllById(products: IFindProducts[]): Promise<Product[]> {
    const productIds = products.map(product => product.id);

    const foundProducts = await this.ormRepository.find({
      where: {
        id: In(productIds),
      },
    });

    return foundProducts;
  }

  public async updateQuantity(
    products: IUpdateProductsQuantityDTO[],
  ): Promise<Product[]> {
    const productIds = products.map(product => product.id);

    const quantityHashMap = Object.assign(
      {},
      ...products.map(product => ({ [product.id]: product.quantity })),
    );

    const foundProducts = await this.ormRepository.find({
      where: {
        id: In(productIds),
      },
    });

    for (let i = 0; i < foundProducts.length; i += 1) {
      foundProducts[i].quantity = quantityHashMap[foundProducts[i].id];
    }

    await this.ormRepository.save(foundProducts);

    return foundProducts;
  }
}

export default ProductsRepository;
