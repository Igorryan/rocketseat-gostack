import * as Yup from 'yup';
import Recipients from '../models/Recipients';

class RecipientsController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      street: Yup.string().required(),
      number: Yup.number()
        .integer()
        .required(),
      complement: Yup.string(),
      state: Yup.string().required(),
      city: Yup.string().required(),
      zip_code: Yup.number()
        .integer()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.json({ error: 'Validation fails' });
    }

    const { name, zip_code, street, number } = req.body;

    const recipientExist = await Recipients.findOne({
      where: {
        name,
        zip_code,
        street,
        number,
      },
    });

    if (recipientExist) {
      return res.json({ error: 'Recipients already exists' });
    }
    // if user.provider;
    await Recipients.create(req.body);

    return res.json({
      name,
      zip_code,
      street,
    });
  }

  async update(req, res) {
    const { id } = req.params;

    const schema = Yup.object().shape({
      name: Yup.string(),
      street: Yup.string(),
      number: Yup.number().integer(),
      complement: Yup.string(),
      state: Yup.string(),
      city: Yup.string(),
      zip_code: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.json({ error: 'Validation fails' });
    }

    const recipient = await Recipients.findByPk(id);

    if (!recipient) {
      return res.json({ error: 'Recipient not exists' });
    }

    const recipientUpdate = await recipient.update(req.body);

    return res.json({ recipient: recipientUpdate });
  }
}

export default new RecipientsController();
