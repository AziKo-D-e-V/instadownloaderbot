const express = require("express");
const config = require("./config");
const { connect } = require("mongoose");
const { Bot, session } = require("grammy");
require("dotenv/config");
const BotController = require("./modules/bot");
const commandBot = require("./helper/commands");
const axios = require("axios");
const cron = require("node-cron");
const token = config.TOKEN;
const port = config.PORT;
const { hydrateReply } = require("@grammyjs/parse-mode");
const bot = new Bot(token);
const app = express();

app.get("/health", (req, res) => {
  res.status(200).send("OK").json({ message: "I'm alive" });
});
app.get("/", (req, res) => {
  res.status(200).send("<b>Bot is alive🎉🥳</b>");
});

app.listen(port, () => {
  console.log(`App is running and listening at http://localhost:${port}`);
});

bot.use(
  session({
    initial: () => ({
      step: "start",
    }),
  })
);

bot.use(hydrateReply);
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

const healthCheckUrl = `https://api.telegram.org/bot${token}/getMe`;
const chatId = "6337122731";
async function healthCheck() {
  try {
    const response = await axios.get(healthCheckUrl);
    if (response.data.ok) {
      await bot.api.sendMessage(chatId, "Bot is healthy");
    } else {
      await bot.api.sendMessage(chatId, "Bot is not healthy");
    }
  } catch (error) {
    await bot.api.sendMessage(chatId, `Health check failed: ${error.message}`);
  }
}

bot.command("healthcheck", async (ctx) => {
  cron.schedule("*/50 * * * * *", healthCheck);
  ctx.reply("Bot has started and health check is scheduled every 50 seconds.");
});
