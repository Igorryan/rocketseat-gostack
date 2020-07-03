import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import RecipientsController from './app/controllers/RecipientsController';
import DeliveriesController from './app/controllers/DeliveriesController';
import DeliverymanController from './app/controllers/DeliverymanController';
import authMiddleware from './app/middlewares/auth';
import authorizationMiddleware from './app/middlewares/authorization';
import AvatarDeliverymansController from './app/controllers/AvatarDeliverymansController';
import DeliveryEndController from './app/controllers/DeliveryEndController';
import DeliveryProblemController from './app/controllers/DeliveryProblemController';

const routes = new Router();
const uploadAvatar = multer(multerConfig.avatar_deliverymans);
const uploadSignature = multer(multerConfig.signature_deliveries);

routes.post('/users', UserController.store);
routes.put('/users', authMiddleware, UserController.update);
routes.post('/sessions', SessionController.store);

routes.get('/deliveryman/:id/deliveries', DeliveryEndController.index);
routes.put('/deliveryman/:id/deliveries/:delivery', DeliveryEndController.update);
routes.post('/deliveryman/:id/deliveries/:delivery', uploadSignature.single('file'), DeliveryEndController.store);
routes.post('/deliveryman/:id/problem', DeliveryProblemController.store);

routes.use(authMiddleware);
routes.use(authorizationMiddleware);

routes.post('/recipients', RecipientsController.store);
routes.put('/recipients/:id', RecipientsController.update);

routes.get('/deliverymans', DeliverymanController.show);
routes.post('/deliverymans', DeliverymanController.store);
routes.put('/deliverymans/:id', DeliverymanController.update);
routes.delete('/deliverymans/:id', DeliverymanController.delete);

routes.get('/deliveries', DeliveriesController.show);
routes.post('/deliveries', DeliveriesController.store);
routes.put('/deliveries/:id', DeliveriesController.update);
routes.delete('/deliveries/:id', DeliveriesController.delete);

routes.get('/distributor/deliveries/problems', DeliveryProblemController.show);
routes.get('/distributor/deliveries/:id/problems', DeliveryProblemController.index);
routes.delete('/distributor/deliveries/problems/:id/cancel-delivery', DeliveryProblemController.delete);

routes.post('/avatar/deliverymans/:id', uploadAvatar.single('file'), AvatarDeliverymansController.store);



export default routes;
