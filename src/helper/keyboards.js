const { InlineKeyboard } = require("grammy");
const videoKey = async (data) => {
  const availableQualities = ["144", "360", "480", "720", "1080", "2160"];
  const inlineKeyboard = new InlineKeyboard();

  const qualities = [
    { quality: "144", label: "144p" },
    { quality: "360", label: "360p" },
    { quality: "720", label: "720p" },
    // Add more qualities as needed
  ];

  // Iterate through the qualities and add buttons to the inline keyboard
  for (const { quality, label } of qualities) {
    if (data.link[quality]) {
      inlineKeyboard.text(label).url(data.link[quality][0]);
    }
  }
  return inlineKeyboard;
};

module.exports = { videoKey };
