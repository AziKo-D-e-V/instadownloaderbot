const request = require("request");
const config = require("../config");

const tiktokVideo = (url) => {
  return new Promise((resolve, reject) => {
    const options = {
      method: "GET",
      url: `https://tiktok-download5.p.rapidapi.com/getVideo`,
      qs: {
        url: url,
        hd: "1",
      },
      headers: {
        "X-RapidAPI-Key": config.KEY_TIKTOK,
        "X-RapidAPI-Host": "tiktok-download5.p.rapidapi.com",
      },
    };

    request(options, function (error, response, body) {
      if (error) {
        reject(error);
        return;
      }
      try {
        const data = JSON.parse(body);

        resolve(data);
      } catch (parseError) {
        reject(parseError);
      }
    });
  });
};

module.exports = tiktokVideo;
