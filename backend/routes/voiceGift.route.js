import express from 'express';
import multer from 'multer';

import * as controller from '../controllers/voiceGift.controller.js';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();

router.post(
  '/',
  upload.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'record', maxCount: 1 },
  ]),
  controller.create
);

router.get('/:id', controller.get);

export default router;
