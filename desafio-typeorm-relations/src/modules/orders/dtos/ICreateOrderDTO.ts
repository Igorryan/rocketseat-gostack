import Customer from '@modules/customers/infra/typeorm/entities/Customer';

export interface IProduct {
  product_id: string;
  price: number;
  quantity: number;
}

export default interface ICreateOrderDTO {
  customer: Customer;
  products: IProduct[];
}
