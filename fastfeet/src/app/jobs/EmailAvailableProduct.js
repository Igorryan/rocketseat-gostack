import Mail from '../../lib/Mail'

class EmailAvailableProduct {
  get key() {
    return 'EmailAvailableProduct';
  }

  async handle({ data }){
    const { recipient, deliveryman, product } = data;

    console.log('A fila executou')

    await Mail.sendMail({
      to: `${deliveryman.name} <${deliveryman.email}>`,
      subject: 'Produto disponível para retirada',
      template: 'cancellation',
      context: {
        product,
        deliveryman: deliveryman.name,
        recipient: recipient.name,
        street: recipient.street,
        number: recipient.number,
        city: recipient.city,
        state: recipient.state,
        zip_code: recipient.zip_code,
        complement: recipient.complement,
      }
    })
  }
}

export default new EmailAvailableProduct();