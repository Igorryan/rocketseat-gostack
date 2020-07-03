import * as Yup from 'yup';
import Deliveryman from '../models/Deliverymans';

class DeliverymanController {

  async show(req, res) {
    const deliverymans = await Deliveryman.findAll({
      order: [['name', 'ASC']],
    });
    return res.json(deliverymans);
  }
  async store(req, res) {
    const { name, email } = req.body;

    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().required(),
      avatar_id: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.json({ error: 'Validation fails' });
    }

    const deliverymanExist = await Deliveryman.findOne({
      where: {
        name,
        email,
      },
    });

    if (deliverymanExist) {
      return res.json({ error: 'Deliveryman already exists' });
    }

    await Deliveryman.create(req.body);

    return res.json(req.body);
  }

  async update(req, res) {
    const { id } = req.params;

    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string(),
      avatar_id: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const deliverymanExist = await Deliveryman.findOne({
      where: {
        id,
      },
    });

    if (!deliverymanExist) {
      return res.status(404).json({ error: 'Deliveryman does not exists' });
    }

    const deliveryman = await deliverymanExist.update(req.body);

    return res.json(deliveryman);
  }

  async delete(req, res) {
    const { id } = req.params;

    const deliveryman = await Deliveryman.findOne({
      where: {
        id,
      },
    });

    if (!deliveryman) {
      return res.status(404).json({ error: 'Deliveryman does not exists' });
    }

    await deliveryman.destroy();

    return res.json();
  }
}
export default new DeliverymanController();
