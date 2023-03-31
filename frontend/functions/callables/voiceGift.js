const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { getFileLink } = require('../services/telegram.service');
const { filePathToTelegramFileId } = require('../services/storage.service');

const create = functions.https.onCall(async (data, context) => {
  try {
    const { avatar, record, name, title, text, backgroundId, audioId } = data;

    const newVoiceGift = {
      name,
      title,
      text,
      backgroundId,
      audioId,
    };

    if (avatar) {
      const avatarId = await filePathToTelegramFileId(avatar);

      newVoiceGift.avatarId = avatarId;
    }

    if (record) {
      const recordId = await filePathToTelegramFileId(record, '.mp3');

      newVoiceGift.recordId = recordId;
    }

    const newItem = await admin
      .firestore()
      .collection('voice-gifts')
      .add(newVoiceGift);

    return newItem.id;
  } catch (err) {
    functions.logger.error(`Error in creating voice gift`, err);
  }
});

const get = functions.https.onCall(async ({ id }, context) => {
  try {
    const snapshot = await admin
      .firestore()
      .collection('voice-gifts')
      .doc(id)
      .get();
    if (!snapshot.exists) return null;

    const { avatarId, recordId } = snapshot.data();
    const avatar = avatarId ? await getFileLink(avatarId) : '';
    const record = recordId ? await getFileLink(recordId) : '';

    return { id: snapshot.id, ...snapshot.data(), avatar, record };
  } catch (err) {
    functions.logger.error(`Error in getting voicegift`, err);
    return null;
  }
});

module.exports = { create, get };
