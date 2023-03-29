import * as dotenv from 'dotenv';
dotenv.config();

const environments = {
  PORT: process.env.PORT,
  TELEGRAM_TOKEN: process.env.TELEGRAM_TOKEN,
  TELEGRAM_CHAT_ID: process.env.TELEGRAM_CHAT_ID,
};

export default environments;
