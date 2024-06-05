require("dotenv").config();
const config = {
  PORT: process.env.PORT,
  TOKEN: process.env.Token,
  DB_URL: process.env.DB_URL,
  KEY: process.env.KEY,
  KEY_TIKTOK: process.env.KEY_TIKTOK,
};

module.exports = config;
