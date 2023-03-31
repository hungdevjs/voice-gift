const admin = require('firebase-admin');
const { create, get } = require('./callables/voiceGift');
const serviceAccount = require('./voice-gift.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'voicegif.appspot.com',
  });
}

exports.create = create;
exports.get = get;
