const axios = require("axios");
const { JSDOM } = require("jsdom");

async function downloadMedia(url) {
  try {
    const response = await axios.post(
      "https://api.downloadgram.org/media",
      `url=${url}&v=3&lang=en`,
      {
        headers: {
          "Content-Type": "text/plain",
        },
      }
    );
    const dom = new JSDOM(response.data);
    const videoSource = dom.window.document.querySelector("source");

    if (videoSource) {
      const videoUrl = videoSource.getAttribute("src");

      return videoUrl.replace(/\\"/g, "");
    } else {
      console.log("Video URL not found");
    }
  } catch (error) {
    console.error("Error downloading media:", error);
    throw error;
  }
}

module.exports = downloadMedia;
