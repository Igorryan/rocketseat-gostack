import * as Yup from 'yup';
import Deliverymans from '../models/Deliverymans';
import Deliveries from '../models/Deliveries';
import Delivery_problems from '../models/Delivery_problems';
import Queue from '../../lib/Queue';

class DeliveryProblemController {
  async store(req, res) {
    const { id } = req.params;
    const { delivery_id, description } = req.body;

    const Schema = Yup.object().shape({
      delivery_id: Yup.number().required(),
      description: Yup.string().required(),
    });

    //Validando dados da requisição
    if (!(await Schema.isValid(req.body))) {
      return res.status(400).json({
        error: 'Validation fails'
      })
    }

    const deliveryman = await Deliverymans.findByPk(id);

    //Verificando se entregador existe
    if (!deliveryman) {
      return res.status(404).json({
        error: 'Deliveryman not found'
      });
    }

    const delivery = await Deliveries.findByPk(delivery_id);

    //Verificando se encomenda existe
    if (!delivery) {
      return res.status(404).json({
        error: 'Delivery not found'
      })
    }

    //Verificando se encomenda pertence ao entregador
    if (delivery.deliveryman_id != id) {
      return res.status(400).json({
        error: 'Order does not belong to the delivery person'
      });
    }

    /*
    Cadastrando problema na tabela delivery_problems
    */


    const delivery_problems = await Delivery_problems.create({
      delivery_id,
      description
    })

    return res.json(delivery_problems);
  }

  async show(req, res) {

    const deliveries_problem = await Delivery_problems.findAll();

    return res.json(deliveries_problem);
  }

  async index(req, res) {
    const { id } = req.params;

    const delivery = await Deliveries.findByPk(id);

    //Verificando se encomenda existe
    if (!delivery) {
      return res.status(404).json({
        error: 'Delivery not found'
      })
    }

    //Buscando problemas da encomenda
    const delivery_problems = await Delivery_problems.findAll({
      where: {
        delivery_id: id
      }
    });

    //Verificando se existe problemas com a encomenda
    if (delivery_problems.length == 0) {
      return res.status(404).json({
        error: 'Order has no problems'
      })
    }

    return res.json(delivery_problems);

  }

  async delete(req, res) {
    const { id } = req.params;

    //Verificando se problema existe
    const delivery_problem = await Delivery_problems.findByPk(id);

    if (!delivery_problem) {
      return res.status(404).json({
        error: 'Delivery problem not found',
      });
    }

    //Cancelando a encomenda

    const delivery = await Deliveries.findByPk(delivery_problem.delivery_id);

    await delivery.update({
      canceled_at: new Date(),
    });

    //Buscando entregador
    const deliveryman = await Deliverymans.findByPk(delivery.deliveryman_id)

    //enviar email com nome do produto e informação de que o produto já está disponível para retirada
    await Queue.add("EmailCanceledProduct", {
      deliveryman,
      product: delivery.product,
      description: delivery_problem.description
    })

    return res.json(delivery);
  }

}

export default new DeliveryProblemController();