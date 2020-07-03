import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';

import TransactionsRepository from '../repositories/TransactionsRepository';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    // Verificando se transaction existe

    const transaction = await transactionsRepository.findOne({ id });

    if (!transaction) {
      throw new AppError('Transaction not found', 404);
    }

    transactionsRepository.delete(id);
  }
}

export default DeleteTransactionService;
