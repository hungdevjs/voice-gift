import TeleBot from 'telebot';

import environments from '../utils/environments.js';

const { TELEGRAM_TOKEN, TELEGRAM_CHAT_ID } = environments;

const bot = new TeleBot({ token: TELEGRAM_TOKEN, buildInPlugins: [] });

export const uploadFile = async ({ buffer, fileName }) => {
  try {
    const res = await bot.sendDocument(TELEGRAM_CHAT_ID, buffer, {
      fileName,
    });
    const fileId = res.document.file_id;

    return fileId;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const getFileLink = async (fileId) => {
  const documentRes = await bot.getFile(fileId);
  return documentRes.fileLink;
};
