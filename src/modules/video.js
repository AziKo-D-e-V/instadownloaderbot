const request = require("request");

const reelsController = (url, type) => {
  return new Promise((resolve, reject) => {
    const options = {
      method: "GET",
      url: `https://instagram-media-downloader.p.rapidapi.com/rapid/${type}.php`,
      qs: { url },
      headers: {
        "X-RapidAPI-Key": "f8fbf89550mshea561890093b7dcp1994a5jsn1950b457f4cb",
        "X-RapidAPI-Host": "instagram-media-downloader.p.rapidapi.com",
      },
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
