const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema(
  {
    user_id: {
      type: Number,
      required: true,
    },
    username: {
      type: String,
    },
    message_id:{
      type: Number,
      required: true,
    },
    video_url:{
      type: String,
      required: true,
    },
    format:{
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("videos", videoSchema);
