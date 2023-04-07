const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { getFileLink } = require('../services/telegram.service');
const { filePathToTelegramFileId } = require('../services/storage.service');
const { getAllFreeAssets } = require('../services/firestore.service');

const create = functions.https.onCall(async (data, context) => {
  const isPremium = !!context.auth?.uid;
  try {
    const {
      avatar,
      record,
      name,
      title,
      text,
      backgroundId,
      audioId,
      customBackground,
      customAudio,
    } = data;

    const { backgrounds, musics } = await getAllFreeAssets();
    if (!isPremium) {
      if (!backgrounds.some((item) => item.id === backgroundId))
        throw new Error('Bad request: Invalid background');
      if (!musics.some((item) => item.id === audioId))
        throw new Error('Bad request: Invalid audio');
    }

    const newVoiceGift = {
      name,
      title,
      text,
      backgroundId,
      audioId,
    };

    if (isPremium) {
      if (!customBackground) {
        if (!backgrounds.some((item) => item.id === backgroundId))
          throw new Error('Bad request: Invalid background');
      }

      if (!customAudio) {
        if (!musics.some((item) => item.id === audioId))
          throw new Error('Bad request: Invalid audio');
      }

      if (customBackground) {
        const customBackgroundId = await filePathToTelegramFileId(
          customBackground
        );
        newVoiceGift.backgroundId = customBackgroundId;
      }

      if (customAudio) {
        const customAudioId = await filePathToTelegramFileId(
          customAudio,
          '.mp3'
        );
        newVoiceGift.audioId = customAudioId;
      }
    }

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

    const { backgrounds, musics } = await getAllFreeAssets();

    const { avatarId, recordId, backgroundId, audioId } = snapshot.data();
    const avatar = avatarId ? await getFileLink(avatarId) : '';
    const record = recordId ? await getFileLink(recordId) : '';
    const background =
      backgrounds.find((item) => item.id === backgroundId)?.url ||
      (await getFileLink(backgroundId));
    const audio =
      musics.find((item) => item.id === audioId)?.bgUrl ||
      (await getFileLink(audioId));

    return {
      id: snapshot.id,
      ...snapshot.data(),
      avatar,
      record,
      background,
      audio,
    };
  } catch (err) {
    functions.logger.error(`Error in getting voicegift`, err);
    return null;
  }
});

module.exports = { create, get };
