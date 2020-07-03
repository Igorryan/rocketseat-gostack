import { getRepository, Repository } from 'typeorm';

import IOrdersRepository from '@modules/orders/repositories/IOrdersRepository';
import ICreateOrderDTO from '@modules/orders/dtos/ICreateOrderDTO';
import Order from '../entities/Order';
import OrdersProducts from '../entities/OrdersProducts';

class OrdersRepository implements IOrdersRepository {
  private ormRepository: Repository<Order>;

  constructor() {
    this.ormRepository = getRepository(Order);
  }

  public async create({ customer, products }: ICreateOrderDTO): Promise<Order> {
    let order = this.ormRepository.create({
      customer,
      order_products: products.map(product => {
        const orderProduct = new OrdersProducts();
        orderProduct.product_id = product.product_id;
        orderProduct.price = product.price;
        orderProduct.quantity = product.quantity;
        return orderProduct;
      }),
    });

    order = await this.ormRepository.save(order);

    return order;
  }

  public async findById(id: string): Promise<Order | undefined> {
    const order = await this.ormRepository.findOne(id);
    return order;
  }
}

export default OrdersRepository;
