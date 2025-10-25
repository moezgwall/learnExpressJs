const mongoose = require("mongoose");

const voiceMessageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    audioUrl: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
    },
    sentAt: {
      type: Date,
      default: Date.now,
    },
    listened: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const voiceMessage = mongoose.model("voiceMessage", voiceMessageSchema);

module.exports = voiceMessage;
