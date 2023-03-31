const TeleBot = require('telebot');

const environments = require('../utils/environments.js');

const { TELEGRAM_TOKEN, TELEGRAM_CHAT_ID } = environments;

const uploadFile = async ({ buffer, fileName }) => {
  const bot = new TeleBot({ token: TELEGRAM_TOKEN, buildInPlugins: [] });

  try {
    const res = await bot.sendDocument(TELEGRAM_CHAT_ID, buffer, {
      fileName,
    });
    const fileId =
      fileName.slice(-3) === 'mp3' ? res.audio.file_id : res.document.file_id;

    return fileId;
  } catch (err) {
    console.error(err);
    return null;
  }
};

const getFileLink = async (fileId) => {
  const bot = new TeleBot({ token: TELEGRAM_TOKEN, buildInPlugins: [] });

  const documentRes = await bot.getFile(fileId);
  return documentRes.fileLink;
};

module.exports = {
  uploadFile,
  getFileLink,
};
