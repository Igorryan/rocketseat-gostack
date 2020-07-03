import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import Product from '@modules/products/infra/typeorm/entities/Product';
import Order from '../infra/typeorm/entities/Order';
import IOrdersRepository from '../repositories/IOrdersRepository';
import { IProduct as IProductDTO } from '../dtos/ICreateOrderDTO';

interface IProduct {
  id: string;
  quantity: number;
}

interface IRequest {
  customer_id: string;
  products: IProduct[];
}

interface IDictionary {
  [key: string]: Product;
}

@injectable()
class CreateOrderService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({ customer_id, products }: IRequest): Promise<Order> {
    const customer = await this.customersRepository.findById(customer_id);

    if (!customer) throw new AppError('Customer not found');

    const productIds = products.map(product => {
      return { id: product.id };
    });

    const foundProducts = await this.productsRepository.findAllById(productIds);

    if (foundProducts.length !== productIds.length)
      throw new AppError('One or more of the specified products do not exist');

    const productsHashMap = Object.assign(
      {},
      ...foundProducts.map(product => {
        return { [product.id]: product };
      }),
    ) as IDictionary;

    const productsWithPrices = products.map(product => {
      if (product.quantity > productsHashMap[product.id].quantity)
        throw new AppError(
          'One or more of the specified products do not have sufficiente quantity for that order',
        );

      productsHashMap[product.id].quantity -= product.quantity;

      return {
        product_id: product.id,
        quantity: product.quantity,
        price: productsHashMap[product.id].price,
      } as IProductDTO;
    });

    const order = await this.ordersRepository.create({
      customer,
      products: productsWithPrices,
    });

    await this.productsRepository.updateQuantity(foundProducts);

    return order;
  }
}

export default CreateOrderService;
