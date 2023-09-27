const config = require("./config");
const { connect } = require("mongoose");
const { Bot, session } = require("grammy");
require("dotenv/config");
const BotController = require("./modules/bot");
const commandBot = require("./helper/commands");
const token = config.TOKEN;
const bot = new Bot(token);

bot.use(
  session({
    initial: () => ({
      step: "start",
    }),
  })
);

bot.use(commandBot);
bot.use(BotController);

const bootstrap = async (bot) => {
  try {
    const connetParams = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };
    connect(config.DB_URL, connetParams);
    console.log("Insta-chop-BOT * * * * - Database connection");
  } catch (error) {
    console.log(error.message);
  }
};
bootstrap();
bot.start(console.log("Insta-chop-BOT started"));
