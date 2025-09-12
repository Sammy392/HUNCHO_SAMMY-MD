const { cmd } = require('../command');
const config = require('../config');

cmd({
  pattern: "owner",
  react: "📞",
  desc: "Send bot owner's contact",
  category: "main",
  filename: __filename
}, async (cmd, mek, m, { from, reply }) => {
  try {
    const ownerName = config.OWNER_NAME || "ᴘᴏᴘᴋɪᴅ";
    const ownerNumber = config.OWNER_NUMBER || "254111385747";

    // Build vCard contact
    const vcard = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      `FN:${ownerName}`,
      `TEL;type=CELL;type=VOICE;waid=${ownerNumber.replace('+', '')}:${ownerNumber}`,
      "END:VCARD"
    ].join('\n');

    // Send vCard contact
    await cmd.sendMessage(from, {
      contacts: {
        displayName: ownerName,
        contacts: [{ vcard }]
      }
    });

    // Send image + caption
    await cmd.sendMessage(from, {
      image: { url: 'https://files.catbox.moe/tbdd5d.jpg' },
      caption: `
╭── ❍ ᴘᴏᴘᴋɪᴅ xᴛʀ❍
│ ✦ 𝙽𝚊𝚖𝚎   : *${ownerName}*
│ ✦ 𝙽𝚞𝚖𝚋𝚎𝚛 : *${ownerNumber}*
│ ✦ 𝚅𝚎𝚛𝚜𝚒𝚘𝚗 : *${config.version || 'Unknown'}*
╰───────────────
> Stay connected for 🔥 updates!`,
      contextInfo: {
        mentionedJid: [`${ownerNumber.replace('+', '')}@s.whatsapp.net`],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363420342566562@newsletter',
          newsletterName: 'ᴘᴏᴘᴋɪᴅ',
          serverMessageId: 143
        }
      }
    }, { quoted: mek });

  } catch (error) {
    console.error("❌ Error in .owner command:", error);
    reply(`⚠️ An error occurred: ${error.message}`);
  }
});
