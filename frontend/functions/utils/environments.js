const dotenv = require('dotenv');
dotenv.config();

const environments = {
  TELEGRAM_TOKEN: process.env.TELEGRAM_TOKEN,
  TELEGRAM_CHAT_ID: process.env.TELEGRAM_CHAT_ID,
};

module.exports = environments;
