import { response } from 'express';
import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

interface CreateTransactionDTO {
  title: string;
  type: 'income' | 'outcome';
  value: number;
}

class CreateTransactionService {
  private transactionsRepository: TransactionsRepository;

  constructor(transactionsRepository: TransactionsRepository) {
    this.transactionsRepository = transactionsRepository;
  }

  public execute({ title, type, value }: CreateTransactionDTO): Transaction {
    if (type === 'outcome') {
      const totalCashValue = this.transactionsRepository.getBalance().total;

      if (value > totalCashValue) {
        throw Error(
          `It was not possible to create a result, the value passed ${value} is greater than the total value ${totalCashValue}`,
        );
      }
    }

    const transaction = this.transactionsRepository.create({
      title,
      type,
      value,
    });

    return transaction;
  }
}

export default CreateTransactionService;
