import express from 'express';

import voiceGiftRoute from './voiceGift.route.js';

const router = express.Router();

router.use('/v1/voice-gifts', voiceGiftRoute);

export default router;
