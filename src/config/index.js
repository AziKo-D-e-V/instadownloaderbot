require("dotenv").config();
const config = {
  TOKEN: process.env.Token,
  DB_URL: process.env.DB_URL,
};

module.exports = config;
