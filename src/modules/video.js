const request = require("request");

const reelsController = (url, type) => {
  return new Promise((resolve, reject) => {
    const options = {
      method: "GET",
      url: `https://instagram-media-downloader.p.rapidapi.com/rapid/${type}.php`,
      qs: { url },
      headers: {
        'X-RapidAPI-Key': '7e5652e7acmsh4c9af6f1bce5b7dp18922ejsnf86ff631a422',
        'X-RapidAPI-Host': 'instagram-media-downloader.p.rapidapi.com'
      }
    };

    request(options, function (error, response, body) {
      if (error) throw new Error(error);
      try {
        const data = JSON.parse(body);
        resolve(data);
      } catch (parseError) {
        reject(parseError);
      }
    });
  });
};

module.exports = reelsController;
