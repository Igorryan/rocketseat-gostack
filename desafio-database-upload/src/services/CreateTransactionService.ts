import { getRepository, getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';
import Category from '../models/Category';

interface Request {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class CreateTransactionService {
  private category_id: string;

  public async execute({
    title,
    type,
    value,
    category,
  }: Request): Promise<Transaction> {
    // Declarando repositorios
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoriesRepository = getRepository(Category);

    // Conferir se nome de categoria já existe
    const categoryExists = await categoriesRepository.findOne({
      where: { title: category },
    });

    if (categoryExists) {
      this.category_id = categoryExists.id;
    }

    // Criando categoria que não existe
    else {
      const newCategory = categoriesRepository.create({
        title: category,
      });

      await categoriesRepository.save(newCategory);

      this.category_id = newCategory.id;
    }

    // Conferir se Transaction pode ser enviado (valor total não pode ficar negativo)
    const { outcome, income } = await transactionsRepository.getBalance();

    if (type === 'outcome' && value + outcome > income) {
      throw new AppError(
        'should not be able to create outcome transaction without a valid balance',
        400,
      );
    }
    // Cadastrar transaction
    const transaction = transactionsRepository.create({
      title,
      type,
      value,
      category_id: this.category_id,
    });

    await transactionsRepository.save(transaction);

    // Retornar transaction
    return transaction;
  }
}

export default CreateTransactionService;
