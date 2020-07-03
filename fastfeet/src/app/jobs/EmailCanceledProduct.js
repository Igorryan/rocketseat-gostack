import Mail from '../../lib/Mail'

class EmailCanceledProduct {
  get key() {
    return 'EmailCanceledProduct';
  }

  async handle({ data }){
    const { deliveryman, product, description } = data;

    console.log('A fila executou')

    await Mail.sendMail({
      to: `${deliveryman.name} <${deliveryman.email}>`,
      subject: 'Produto cancelado devido à um problema',
      template: 'DeliveryProblemCancellation',
      context: {
        deliveryman: deliveryman.name,
        product,
        description,
      }
    })
  }
}

export default new EmailCanceledProduct();