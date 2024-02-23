const { Router } = require("@grammyjs/router");
const router = new Router((ctx) => ctx.session.step);
const usersModel = require("../models/users.model");
const reelsController = require("./video");
const videoModel = require("../models/video.model");
const bot = require("../helper/commands");
const tiktokVideo = require("./tiktok.video");

const channelUlr = "@azyutubot";
const from_chat_id = "@adsgasdh";
const captions = "@insta_chopbot Videolarni bot orqali chopamiz...😜😉";
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
text.on("message::url", async (ctx) => {
  try {
    const text = ctx.message.text;
    const username = ctx.from?.username || "";
    const user_id = ctx.from.id;
    const chat_id = ctx.chat.id;
    const isInsta = text.split("/")[2];
    const isTikTok = text.split("/")[2];

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
    } else if (isTikTok == "www.tiktok.com" || isTikTok == "vt.tiktok.com") {
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
          await ctx.reply("Siz yuborgan TikTok havolani topib bo'lmadi😔😔😔");
        }
      } else {
        const data = await tiktokVideo(text);
        
        if (data.data.message) {
          const frm = -1001926273739;

          ctx.api.sendMessage(frm, data.data.message);
        } else {
          const url = data.data.hdplay || data.data.wmplay || data.data.play;

          if (!url) {
            await ctx.reply("Siz yuborgan Instagram havolani topib bo'lmadi");
            ctx.session.step = "text";
          }
          try {
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
            ctx.session.step = "text";
          } catch (error) {
            ctx.api.sendMessage(
              5634162263,
              "Error command 'text'\n\n" + error.message
            );
          }
        }
      }
    }
  } catch (error) {
    ctx.session.step = "text";
    await ctx.reply("Siz yuborgan havolani topib bo'lmadi");
    ctx.api.sendMessage(5634162263, "Error command 'text'\n\n" + error.message);
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
    ctx.api.sendMessage(5634162263, "Error command 'info'\n\n" + error.message);
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
    ctx.api.sendMessage(5634162263, "Error command 'dev'\n\n" + error.message);
    console.log(error);
  }
});

bot.command("send_ad", async (ctx) => {
  try {
    const admin_id = 5634162263;
    if (ctx.from.id === admin_id) {
      await ctx.reply("Reklama xabarini jo'nating");
      ctx.session.step = "catch_ad";
    } else {
      await ctx.reply("Iltimos Instagram havolani jo'nating");
      ctx.session.step = "text";
    }
  } catch (error) {
    ctx.session.step = "text";
    console.log(error);
  }
});

const catchAd = router.route("catch_ad");
catchAd.on("message", async (ctx) => {
  try {
    const message = ctx.message.message_id;
    const chat_id = 5634162263;
    const users = await usersModel.find();
    for (let i = 0; i < users.length; i++) {
      try {
        const user_id = users[i].user_id;
        await ctx.api.copyMessage(user_id, chat_id, message);
      } catch (error) {
        i++;
        const user_id = users[i].user_id;
        await ctx.api.copyMessage(user_id, chat_id, message);
      }
    }
    await ctx.reply("Reklama hamma users ga jo'natildi✅✅✅");
  } catch (error) {
    ctx.reply("Reklama yuborishda xatolik ro'y berdi😔\n\n" + error.message);
    ctx.session.step = "send_ad";
    console.log(error);
  }
});

module.exports = router;
