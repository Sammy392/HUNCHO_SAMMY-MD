// config.cjs
const fs = require("fs");
require("dotenv").config();

const config = {
  // Session & prefix
  SESSION_ID: process.env.SESSION_ID || "HUNCHO;;;eJByhRQC#Na7zwI7DzM6-G5kBj_PBW7nEz1Hm7F6ctEPzV6vBtwo",
  PREFIX: process.env.PREFIX || '.',

  // Branding & menu captions
  BOT_NAME: process.env.BOT_NAME || "huncho bot",
  BOT: process.env.BOT || "hello 👋",
  NEW_CMD: process.env.NEW_CMD || "ᴀᴅᴅᴠᴀʀ\n│ sᴜᴅᴏ\| huncho",
  CAPTION: process.env.CAPTION || "ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴘᴏᴘᴋɪᴅ ᴋᴇ",
  REPO_IMAGE_URL: process.env.REPO_IMAGE_URL || 'https://files.catbox.moe/kiy0hl.jpg',
  NEWSLETTER_CHANNEL_ID: process.env.NEWSLETTER_CHANNEL_ID || '120363290715861418@newsletter',
  REPO_LINK: process.env.REPO_LINK || 'https://github.com/Sammy392/HUNCHO_SAMMY-MD',
  // Auto features
  AUTO_STATUS_SEEN: process.env.AUTO_STATUS_SEEN !== undefined ? process.env.AUTO_STATUS_SEEN === 'true' : true,
  AUTO_BIO: process.env.AUTO_BIO !== undefined ? process.env.AUTO_BIO === 'true' : true,
  AUTO_STATUS_REACT: process.env.AUTO_STATUS_REACT !== undefined ? process.env.AUTO_STATUS_REACT === 'true' : true,
  AUTO_READ: process.env.AUTO_READ !== undefined ? process.env.AUTO_READ === 'true' : false,
  AUTO_TYPING: process.env.AUTO_TYPING !== undefined ? process.env.AUTO_TYPING === 'true' : false,
  AUTO_RECORDING: process.env.AUTO_RECORDING !== undefined ? process.env.AUTO_RECORDING === 'true' : false,
  AUTO_REACT: process.env.AUTO_REACT !== undefined ? process.env.AUTO_REACT === 'false' : false,
  AUTO_STICKER: process.env.AUTO_STICKER !== undefined ? process.env.AUTO_STICKER === 'true' : false,

  // Status interaction
  AUTOLIKE_EMOJI: process.env.AUTOLIKE_EMOJI || '🩷',
  AUTO_REPLY_STATUS: process.env.AUTO_REPLY_STATUS !== undefined ? process.env.AUTO_REPLY_STATUS === 'true' : false,
  STATUS_READ_MSG: process.env.STATUS_READ_MSG || 'Status Viewed by Huncho-Md',

  // Anti features
  ANTI_LEFT: process.env.ANTI_LEFT !== undefined ? process.env.ANTI_LEFT === 'true' : true,
  ANTI_DELETE: process.env.ANTI_DELETE !== undefined ? process.env.ANTI_DELETE === 'true' : true,
  AUTO_BLOCK: process.env.AUTO_BLOCK !== undefined ? process.env.AUTO_BLOCK === 'true' : true,
  REJECT_CALL: process.env.REJECT_CALL !== undefined ? process.env.REJECT_CALL === 'true' : false,
  NOT_ALLOW: process.env.NOT_ALLOW !== undefined ? process.env.NOT_ALLOW === 'true' : true,

  // Chatbot features
  CHAT_BOT: process.env.CHAT_BOT !== undefined ? process.env.CHAT_BOT === 'true' : false,
  CHAT: process.env.CHAT !== undefined ? process.env.CHAT === 'true' : false,
  CHAT_BOT_MODE: process.env.CHAT_BOT_MODE || "public",
  SLIKE: process.env.SLIKE !== undefined ? process.env.SLIKE === 'true' : true,

  // General bot settings
  MODE: process.env.MODE || "public",
  DELETED_MESSAGES_CHAT_ID: process.env.DELETED_MESSAGES_CHAT_ID || "12345678901",
  OWNER_NAME: process.env.OWNER_NAME || "huncho",
  OWNER_NUMBER: process.env.OWNER_NUMBER ? process.env.OWNER_NUMBER.split(',') : "254769569210",
  SUDO_NUMBER: process.env.SUDO_NUMBER ? process.env.SUDO_NUMBER.split(',') : ["254769569210"],

  // API keys
  GEMINI_KEY: process.env.GEMINI_KEY || "AIzaSyCUPaxfIdZawsKZKqCqJcC-GWiQPCXKTDc",
GPT_API_KEY: process.env.GPT_API_KEY || "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", // Groq key
  GROQ_API_KEY: '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',
  WEATHER_API_KEY: "ec32bfa1c6b8ff81a636877b6ba302c8",
  GEMINI_KEY: process.env.GEMINI_KEY || "AIzaSyCUPaxfIdZawsKZKqCqJcC-GWiQPCXKTDc",
  
  // Welcome feature
  WELCOME: process.env.WELCOME !== undefined ? process.env.WELCOME === 'true' : false,
};

module.exports = config;
