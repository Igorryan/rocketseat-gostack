import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import Transaction from './Transaction';

@Entity('categories')
class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @OneToMany(() => Transaction, transaction => transaction.category)
  transaction: Transaction;

  @Column()
  created_at: Date;

  @Column()
  updated_at: Date;
}

export default Category;
