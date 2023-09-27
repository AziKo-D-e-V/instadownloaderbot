const { Router } = require("@grammyjs/router");
const router = new Router((ctx) => ctx.session.step);
const usersModel = require("../models/users.model");
const reelsController = require("./video");
const videoModel = require("../models/video.model");
const bot = require("../helper/commands");

const channelUlr = "@azyutubot";
const from_chat_id = "@adsgasdh";
const captions =
  "@insta_chopbot Instagramdagi videolarni bot orqali chopamiz...😜😉";
bot.command("start", async (ctx) => {
  try {
    const first_name = ctx.from?.first_name || "";
    const last_name = ctx.from?.last_name || "";
    const user_id = ctx.from.id;
    const username = ctx.from?.username || "";
    await ctx.reply(
      `Assalom aleykum  <b>${
        first_name || last_name
      }</b>👋 \n\nMenga <b> Instagram  havola(ssilka)</b>ni🔗  yuboring`,
      {
        reply_markup: {
          remove_keyboard: true,
        },
        parse_mode: "HTML",
      }
    );

    const findUser = await usersModel.find({ user_id });
    if (findUser.length < 1) {
      const newUser = await usersModel.create({
        first_name,
        last_name,
        username,
        user_id,
      });
      ctx.api.sendMessage(
        from_chat_id,
        `#new_user\n\n    First Name: <b>${newUser.first_name}</b>\n    Last Name: <b>${newUser.last_name}</b>\n👤Username: <b>${newUser.username}</b>\n🗿User_id: <tg-spoiler>${newUser.user_id}</tg-spoiler>`,
        {
          parse_mode: "HTML",
        }
      );
      ctx.session.step = "text";
    }
    ctx.session.step = "text";
  } catch (error) {
    ctx.session.step = "start";
    console.log(error);
  }
});

const text = router.route("text");
text.on(":text", async (ctx) => {
  try {
    const text = ctx.message.text;
    const username = ctx.from?.username || "";
    const user_id = ctx.from.id;
    const chat_id = ctx.chat.id;
    const isInsta = text.split("/")[2];
    if (isInsta === "www.instagram.com" || isInsta === "instagram.com") {
      const isReels = text.split("/")[3];

      if (isReels === "reel") {
        const typingMessage = await ctx.reply("⏳");
        const message_id = typingMessage.message_id;
        await ctx.api.deleteMessage(chat_id, message_id - 1);

        const findVideo = await videoModel.findOne({ video_url: text });
        if (findVideo) {
          try {
            const copymsg = findVideo.message_id;

            const video = await ctx.api.copyMessage(
              chat_id,
              from_chat_id,
              copymsg,
              {
                caption: captions,
              }
            );

            await ctx.api.deleteMessage(chat_id, video.message_id - 1);

            ctx.session.step = "text";
          } catch (error) {
            const data = await reelsController(text, "post_v2");
            if (data.message) {
              const frm = -1001926273739;
              await ctx.reply(
                "Siz yuborgan Instagram havolani topib bo'lmadi😔😔😔"
              );
              ctx.api.sendMessage(frm, data.message);
            } else {
              const url = data.items["0"].video_versions[0].url;

              const videoSend = ctx.replyWithVideo(url, {
                caption: captions,
              });

              await ctx.api.deleteMessage(chat_id, message_id);

              const sendVid = await ctx.api.sendVideo(from_chat_id, url);

              const saveDb = await videoModel.create({
                username,
                user_id,
                video_url: text,
                message_id: sendVid.message_id,
              });
            }
            ctx.session.step = "text";
            console.log(error);
          }
        } else {
          const data = await reelsController(text, "post_v2");

          if (data.message) {
            const frm = -1001926273739;
            await ctx.reply(
              "Siz yuborgan Instagram havolani topib bo'lmadi😔😔😔"
            );
            ctx.api.sendMessage(frm, data.message);
          } else {
            const url = data.items["0"].video_versions[0].url;

            const videoSend = await ctx.replyWithVideo(url, {
              caption: captions,
            });

            await ctx.api.deleteMessage(chat_id, message_id);
            const sendVid = await ctx.api.sendVideo(from_chat_id, url);
            const saveDb = await videoModel.create({
              username,
              user_id,
              video_url: text,
              message_id: sendVid.message_id,
            });
          }

          ctx.session.step = "text";
        }
      } else if (isReels === "stories") {
        const typingMessage = await ctx.reply("⏳");
        const message_id = typingMessage.message_id;

        await ctx.api.deleteMessage(chat_id, message_id - 1);

        const findStory = await videoModel.findOne({ video_url: text });

        if (findStory) {
          const copymsg = findStory.message_id;

          const video = await ctx.api.copyMessage(
            chat_id,
            from_chat_id,
            copymsg,
            {
              caption: captions,
            }
          );

          await ctx.api.deleteMessage(chat_id, video.message_id - 1);

          ctx.session.step = "text";
        } else {
          const data = await reelsController(text, "stories");
          if (data.message) {
            const frm = -1001926273739;
            await ctx.reply(
              "Siz yuborgan Instagram havolani topib bo'lmadi😔😔😔"
            );
            ctx.api.sendMessage(frm, data.message);
          } else {
            const url = data.video;
            if (data.video == undefined) {
              await ctx.api.deleteMessage(chat_id, message_id);
              ctx.reply(
                `Bot private story larni yuklay olmaydi❗\nStory ni private emasligiga ishonch hosil qiling...❗`
              );
            } else {
              await ctx.api.deleteMessage(chat_id, message_id);

              ctx.replyWithVideo(url, {
                caption: captions,
              });

              const sendVid = await ctx.api.sendVideo(from_chat_id, url);
              const saveDb = await videoModel.create({
                username,
                user_id,
                video_url: text,
                message_id: sendVid.message_id,
              });
            }
            ctx.session.step = "text";
          }
        }
      } else if (isReels === "p") {
        const typingMessage = await ctx.reply("⏳");
        const message_id = typingMessage.message_id;

        await ctx.api.deleteMessage(chat_id, message_id - 1);
        const findMedia = await videoModel.find({ video_url: text });

        if (findMedia.length > 0) {
          const copymsg = findMedia.filter((id) => id);
          for (const id of findMedia) {
            const video = await ctx.api.copyMessage(
              chat_id,
              from_chat_id,
              id.message_id,
              {
                caption: captions,
              }
            );
          }

          await ctx.api.deleteMessage(chat_id, ctx.message.message_id + 1);

          ctx.session.step = "text";
        }

        const data = await reelsController(text, "post");

        if (data.message) {
          const frm = -1001926273739;
          await ctx.reply(
            "Siz yuborgan Instagram havolani topib bo'lmadi😔😔😔"
          );
          ctx.api.sendMessage(frm, data.message);
        } else {
          const urls = [
            data?.["0"],
            data?.["1"],
            data?.["2"],
            data?.["3"],
            data?.["4"],
            data?.["5"],
            data?.["6"],
            data?.["7"],
            data?.["8"],
            data?.["9"],
            data?.["10"],
          ];
          const validUrls = urls.filter((url) => url);

          for (const url of validUrls) {
            const media = {
              type: url.split("?")[0].endsWith(".mp4") ? "video" : "photo",
              media: url,
            };
            if (media.type === "video") {
              await ctx.replyWithVideo(url, {
                caption: captions,
              });

              const sendVid = await ctx.api.sendVideo(from_chat_id, url);
              const saveDb = await videoModel.create({
                username,
                user_id,
                video_url: text,
                message_id: sendVid.message_id,
              });
            } else {
              await ctx.replyWithPhoto(url, {
                caption: captions,
              });

              const sendVid = await ctx.api.sendPhoto(from_chat_id, url);
              const saveDb = await videoModel.create({
                username,
                user_id,
                video_url: text,
                message_id: sendVid.message_id,
              });
            }
          }
          await ctx.api.deleteMessage(chat_id, message_id);
        }
        ctx.session.step = "text";
      }
    } else {
      await ctx.reply("Iltimos Instagram havolani jo'nating");
      ctx.session.step = "text";
    }
  } catch (error) {
    ctx.session.step = "text";
    await ctx.reply("Siz yuborgan Instagram havolani topib bo'lmadi");
    console.log(error);
  }
});

bot.command("count", async (ctx) => {
  try {
    const chatId = ctx.chat.id;
    const user_id = ctx.from.id;
    if (user_id == 5634162263) {
      const messageCount = await videoModel.count();
      const userCount = await usersModel.count();

      const counter = `📝All messages: ${messageCount}\n\n👥Users: ${userCount}`;

      await ctx.api.sendMessage(chatId, counter);

      ctx.session.step = "text";
    } else {
      ctx.reply("/count commanddasini ko'rish uchun sizda ruxsat yo'q😔");
      ctx.session.step = "text";
    }
  } catch (error) {
    ctx.session.step = "text";
    console.log(error);
  }
});

// bot.command("admin_advertisement", async (ctx) => {
//   const admin = ctx.from.id;

//   ctx.reply("Reklama matnini jo'nating");

//   if (admin === 5634162263) {
//     const ad = ctx.message.text;
//     console.log(ctx);
//     const message = ctx.message.id
//     const users = await usersModel.find();
//     const filters = users.filter((id) => id);

//     for (const id of filters) {
//       const user_id = id.user_id;
//       console.log(user_id);
//       // await ctx.api.sendMessage(user_id, ad)
//     }
//   } else {
//     ctx.reply("Bu komandadan foydalanishga sizga ruxsat yo'q ");
//   }
// });

bot.command("info", (ctx) => {
  try {
    const copymsg1 = 22;
    const copymsg2 = 23;
    const chatId = ctx.chat.id;
    const from_chat_id = -1001975830564;
    ctx.api.copyMessage(chatId, from_chat_id, copymsg1);
    ctx.api.copyMessage(chatId, from_chat_id, copymsg2);
    ctx.session.step = "text";
  } catch (error) {
    ctx.session.step = "text";

    console.log(error);
  }
});

bot.command("dev", (ctx) => {
  try {
    const copymsg = 21;
    const chatId = ctx.chat.id;
    const from_chat_id = -1001975830564;
    ctx.api.copyMessage(chatId, from_chat_id, copymsg);
    ctx.session.step = "text";
  } catch (error) {
    ctx.session.step = "text";

    console.log(error);
  }
});

module.exports = router;
