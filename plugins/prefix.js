
const { cmd } = require('../command');

const config = require('../config');

const { setPrefix } = require('../lib/prefix');

cmd({

  pattern: "setprefix",

  alias: ["prefix"],

  react: "🪄",

  desc: "Change the bot's command prefix.",

  category: "settings",

  filename: __filename,

}, async (cmd, mek, m, { args, isCreator, reply }) => {

  if (!isCreator) return reply("*📛 Only the owner can use this command!*");

  const newPrefix = args[0];

  if (!newPrefix) return reply("❌ Provide new prefix. Example: `.setprefix !`");

  setPrefix(newPrefix); // updates without reboot

  return reply(`✅ Prefix updated to *${newPrefix}* `);

});



  
