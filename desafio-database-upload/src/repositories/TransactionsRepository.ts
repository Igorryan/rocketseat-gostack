import { EntityRepository, Repository, getRepository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactionsRepository = getRepository(Transaction);

    const income = (
      await transactionsRepository.find({
        where: { type: 'income' },
      })
    ).reduce((acc, transaction) => acc + transaction.value, 0);

    const outcome = (
      await transactionsRepository.find({
        where: { type: 'outcome' },
      })
    ).reduce((acc, transaction) => acc + transaction.value, 0);

    const total = income - outcome;

    const balance = {
      income,
      outcome,
      total,
    };

    return balance;
  }
}

export default TransactionsRepository;
