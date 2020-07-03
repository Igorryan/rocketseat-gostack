import Sequelize from 'sequelize';

import User from '../app/models/User';
import Recipients from '../app/models/Recipients';
import Deliverymans from '../app/models/Deliverymans';
import Deliveries from '../app/models/Deliveries';
import AvatarDeliverymans from '../app/models/AvatarDeliverymans'
import SignatureDeliveries from '../app/models/SignatureDeliveries'
import Delivery_problems from '../app/models/Delivery_problems'

import databaseConfig from '../config/database';

const models = [User, Recipients, Deliverymans, Deliveries, AvatarDeliverymans, SignatureDeliveries, Delivery_problems];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);
    models.map(model => model.init(this.connection));
    models.map(
      model => model.associate && model.associate(this.connection.models)
    );
  }
}

export default new Database();
