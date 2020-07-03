import AvatarDeliverymans from '../models/AvatarDeliverymans';
import Deliverymans from '../models/Deliverymans';
import fs from 'fs';

class AvatarDeliverymansController {
  async store(req, res) {
    const { id } = req.params;
    const { originalname: name, filename: path } = req.file;

    function deletePhotoDirectory() {
      fs.unlink(`./tmp/uploads/avatar_deliverymans/${path}`, function (err) {
        if (err) console.log(err);
      });
    }

    const deliveryman = await Deliverymans.findByPk(id)

    if (!deliveryman) {
      deletePhotoDirectory();
      return res.status(404).json({ error: 'Delivery man does not exist' });
    }

    if (deliveryman.avatar_id) {
      deletePhotoDirectory();
      return res.status(400).json({ error: 'Delivery man already has photo' })
    };

    const file = await AvatarDeliverymans.create({ name, path });

    await deliveryman.update({ avatar_id: file.id });

    return res.json(file);
  }

}

export default new AvatarDeliverymansController();
