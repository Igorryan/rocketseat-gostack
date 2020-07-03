import * as Yup from 'yup';
import { isAfter, getHours } from 'date-fns';
import Deliveries from '../models/Deliveries';
import Recipients from '../models/Recipients';
import Deliverymans from '../models/Deliverymans';
import { convertDateFormat } from '../../lib/me';
import Queue from '../../lib/Queue';

class DeliveriesController {

  async show(req, res) {
    const deliveries = await Deliveries.findAll();

    return res.json(deliveries);
  }

  async store(req, res) {
    const { deliveryman_id, recipient_id, product } = req.body;

    const Schema = Yup.object().shape({
      recipient_id: Yup.number()
        .integer()
        .required(),
      deliveryman_id: Yup.number()
        .integer()
        .required(),
      product: Yup.string().required(),
    });

    if (!(await Schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const deliveryman = await Deliverymans.findByPk(deliveryman_id)

    if (!deliveryman) {
      return res.status(404).json({ error: 'Deliveryman not found' });
    }

    const recipient = await Recipients.findByPk(recipient_id);
    
    if (!recipient) {
      return res.status(404).json({ error: 'Recipient not found' });
    }

    const deliveries = await Deliveries.create(req.body);

    //enviar email com nome do produto e informação de que o produto já está disponível para retirada

    await Queue.add("EmailAvailableProduct", {
      recipient,
      deliveryman,
      product,
    })


    return res.json(deliveries);
  }

  async update(req, res) {
    const { id } = req.params;
    const { start_date, end_date } = req.body;
    const timezone = 3;
    const delivery = await Deliveries.findByPk(id);
    const startWithdrawals = 8;
    const endWithdrawals = 18;

    const Schema = Yup.object().shape({
      product: Yup.string(),
      start_date: Yup.string(),
      end_date: Yup.string(),
    });

    if (!(await Schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Validation fails' });
    }

    if (!delivery) {
      return res.status(404).json({ error: 'Delivery not found' });
    }

    if (start_date) {
      const date = await convertDateFormat(start_date, timezone);
      const hour = getHours(date) + timezone;

      if (!(hour >= startWithdrawals && hour <= endWithdrawals)) {
        return res.status(401).json({
          error: `Withdrawals can only be made between ${startWithdrawals} and ${endWithdrawals}`,
        });
      }
      req.body.start_date = date;
    }

    if (end_date) {
      const date = await convertDateFormat(end_date, 3);

      if (!delivery.start_date) {
        return res.status(401).json({
          error: 'Delivery not withdrawn',
        });
      }

      if (!(await isAfter(date, delivery.start_date))) {
        return res.status(401).json({
          error: 'Delivery date must be greater than the withdrawal date',
        });
      }

      req.body.end_date = date;
    }

    const deliveryUpdated = await delivery.update(req.body);
    return res.json(deliveryUpdated);
  }

  async delete(req, res) {
    const { id } = req.params;

    const delivery = await Deliveries.findByPk(id);

    if (!delivery) {
      return res.status(404).json({ error: "Delivery not found" });
    }

    await delivery.destroy();

    return res.json({message: "Deleted delivery"});
  }
}

export default new DeliveriesController();
