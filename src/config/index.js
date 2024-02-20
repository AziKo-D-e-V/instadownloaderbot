require("dotenv").config();
const config = {
  TOKEN: process.env.Token,
  DB_URL: process.env.DB_URL,
  KEY: process.env.KEY,
};

module.exports = config;
