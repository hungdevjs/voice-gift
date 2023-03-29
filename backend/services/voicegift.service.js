import { firestore } from '../configs/admin.config.js';
import { uploadFile, getFileLink } from './telegram.service.js';

export const create = async (data) => {
  const { avatar, record, name, title, text, backgroundId, audioId } = data;

  const newVoiceGift = {
    name,
    title,
    text,
    backgroundId,
    audioId,
  };

  if (avatar) {
    const avatarId = await uploadFile({
      buffer: avatar.buffer,
      fileName: 'avatar',
    });

    newVoiceGift.avatarId = avatarId;
  }

  if (record) {
    const recordId = await uploadFile({
      buffer: record.buffer,
      fileName: 'record',
    });

    newVoiceGift.recordId = recordId;
  }

  const newItem = await firestore.collection('voice-gifts').add(newVoiceGift);
  return newItem.id;
};

export const get = async (id) => {
  const snapshot = await firestore.collection('voice-gifts').doc(id).get();
  if (!snapshot.exists) return null;

  const { avatarId, recordId } = snapshot.data();
  const avatar = avatarId ? await getFileLink(avatarId) : '';
  const record = recordId ? await getFileLink(recordId) : '';

  return { id: snapshot.id, ...snapshot.data(), avatar, record };
};
