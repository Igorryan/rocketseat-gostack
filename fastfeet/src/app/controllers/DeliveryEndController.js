import Deliveries from '../models/Deliveries';
import SignatureDeliveries from '../models/SignatureDeliveries';
import {getHours, isToday } from 'date-fns';
import Deliveries from '../models/Deliveries';
import fs from 'fs';

class DeliveryEndController {
  async store(req, res) {
    const { id, delivery: delivery_id } = req.params;
    const { originalname: name, filename: path } = req.file;

    //Deletar as fotos salvas no diretorio
    function deletePhotoDirectory() {
      fs.unlink(`./tmp/uploads/signature_deliveries/${path}`, function (err) {
        if (err) console.log(err);
      });
    }

    //Busca a entrega
    const delivery = await Deliveries.findByPk(delivery_id);

    //Verifica se entrega existe
    if (!delivery) {
      deletePhotoDirectory();
      return res.status(404).json({
        error: 'Delivery not found',
      });
    }

    //Verifica se o entregador é responsavel pela entrega
    if (!delivery.deliveryman_id == id) {
      return res.status(400).json({
        error: 'Delivery does not belong to this deliveryman',
      });
    }

    //Verifica se o encomenda ja foi retirada
    if (!delivery.start_date) {
      return res.status(401).json({
        error: 'Delivery not withdrawn',
      });
    }

    //Verifica se encomenda já possui assinatura de retirada para substituir na pasta e no banco
    if(delivery.signature_id){
      const signature = await SignatureDeliveries.findByPk(delivery.signature_id);
      fs.unlink(`./tmp/uploads/signature_deliveries/${signature.path}`, function (err) {
        if (err) console.log(err);
      });
      await signature.destroy();
    }

    //Cria a assinatura na tabela de assinaturas
    const file = await SignatureDeliveries.create({ name, path });

    //Atualiza a encomenda
    await delivery.update({ end_date: new Date(), signature_id: file.id });

    return res.status(200).json();

  }

  async index(req, res) {
    const { id } = req.params;
    const { end_date } = req.query; //?end_date=true

    //Cria um array com as encomendas pendentes do entregador (pendentes: não cancelados e não entregados)
    async function SearchPendingDeliveries() {
      const deliveries = await Deliveries.findAll({ where: { deliveryman_id: id, end_date: null, canceled_at: null } });

      if (!deliveries) {
        return res.status(404).json({ error: 'delivery person has no pending deliveries' });
      }

      return deliveries;
    }

    //Cria um array com as encomendas finalizadas pelo entregador (finalizadas: entregues, com end_date);
    async function SearchCompletedDeliveries() {
      var deliveries = await Deliveries.findAll({ where: { deliveryman_id: id, canceled_at: null } });

      if (!deliveries) {
        return res.status(404).json({ error: 'delivery person has no completed deliveries' })
      }

      deliveries = deliveries.filter(d => {
        if (d.end_date) return d;
      });

      return deliveries;

    }

    if (end_date) {
      return res.json(await SearchCompletedDeliveries());
    }

    return res.json(await SearchPendingDeliveries());

  }

  async update(req, res) {
    const { id, delivery: delivery_id } = req.params;
    const startWithdrawals = 8;
    const endWithdrawals = 22;
    const hour = getHours(new Date());

    console.log(hour)

    //Retorna os encomendas do entregador
    const deliveries = await Deliveries.findAll({ where: { deliveryman_id: id } });

    //Cria um array com os encomendas que foram retirados para entrega hoje
    const deliveriesToday = deliveries.filter(d => {
      if (d.start_date) {
        if (isToday(d.start_date)) {
          return d;
        }
      }
    });

    //Verifica se a quantidade de encomendas retirados hoje
    if (deliveriesToday.length >= 5) {
      return res.status(405).json({
        error: 'Not permitted: You can only withdraw 5 orders per day',
      })
    }

    //Retorna o encomenda solicitado
    const delivery = await Deliveries.findByPk(delivery_id);

    //Verifica se encomenda existe
    if (!delivery) {
      return res.status(404).json({
        error: 'Delivery not found',
      });
    }

    //Verifica se encomenda pertence ao entregador
    if (!delivery.deliveryman_id == id) {
      return res.status(400).json({
        error: 'Delivery does not belong to this deliveryman',
      });
    }

    //Verifica se encomenda já foi retirada
    if(delivery.start_date){
      return res.status(400).json({
        error: 'Delivery has already been withdrawn',
      });
    }

    //Verifica se horario da retirada é válido
    if (!(hour >= startWithdrawals && hour <= endWithdrawals)) {
      return res.status(401).json({
        error: `Withdrawals can only be made between ${startWithdrawals} and ${endWithdrawals}`,
      });
    }

    await delivery.update({ start_date: new Date() });

    return res.status(200).json();

  }

}

export default new DeliveryEndController();