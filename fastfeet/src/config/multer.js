import multer from 'multer';
import crypto from 'crypto';
import { extname, resolve } from 'path';

export default {
  avatar_deliverymans: {
    storage: multer.diskStorage({
      destination: resolve(__dirname, '..', '..', 'tmp', 'uploads', 'avatar_deliverymans'),
      filename: (req, file, cb) => {
        crypto.randomBytes(16, (err, res) => {
          if (err) return cb(err);
          return cb(null, res.toString('hex') + extname(file.originalname));
        });
      },
    }),
  },
  signature_deliveries: {
    storage: multer.diskStorage({
      destination: resolve(__dirname, '..', '..', 'tmp', 'uploads', 'signature_deliveries'),
      filename: (req, file, cb) => {
        crypto.randomBytes(16, (err, res) => {
          if (err) return cb(err);
          return cb(null, res.toString('hex') + extname(file.originalname));
        });
      },
    }),
  }
};
