
const {getContextInfo} = require('./new')
const axios = require("axios");
const config = require('../config');
const { cmd } = require('../command');

cmd({
  pattern: "ss",
  alias: ["ssweb"],
  react: "🚀",
  desc: "Download screenshot of a given link.",
  category: "convert",
  use: ".ss <link>",
  filename: __filename,
}, 
async (conn, mek, m, {
  from, l, quoted, body, isCmd, command, args, q, isGroup, sender, 
  senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, 
  groupMetadata, groupName, participants, isItzcp, groupAdmins, 
  isBotAdmins, isAdmins, reply 
}) => {
  if (!q) {
    return reply("Please provide a URL to capture a screenshot.");
  }

  try {
    
    const response = await axios.get(`https://bk9.fun/tools/screenshot?device=tablet&url= ${q}`);
    const screenshotUrl = response.data.screenshotUrl;

    // give credit and use
    const imageMessage = {
      image: { url: screenshotUrl },
      caption: "*DML SS WEB*\n\n> *SCREESHOT TAKEN BY DML-MD🤳🏻*",
      contextInfo: getContextInfo(m.sender)
    };

    await conn.sendMessage(from, imageMessage, { quoted: m });
  } catch (error) {
    console.error(error);
    reply("Failed to capture the screenshot. Please try again.");
  }
});
