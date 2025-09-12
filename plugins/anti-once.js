const { cmd } = require("../command");

const BOT_NAME = "⚡ POPKID XTR BOT";
const BOT_IMAGE = "https://files.catbox.moe/tbdd5d.jpg";

cmd({
  pattern: "vv2",
  alias: ["wah", "ohh", "oho", "🙂", "😂", "❤️", "💋", "🥵", "🌚", "😒", "nice", "ok"],
  desc: "Owner Only - retrieve quoted view-once message back to user",
  category: "owner",
  filename: __filename
}, async (client, message, match, { from, isCreator }) => {
  try {
    if (!isCreator) {
      return; // Only works for owner
    }

    if (!match.quoted) {
      return await client.sendMessage(
        from,
        {
          text: "🍁 *Please reply to a view-once image, video, or audio!*"
        },
        { quoted: message }
      );
    }

    const buffer = await match.quoted.download();
    const mtype = match.quoted.mtype;
    const options = { quoted: message };

    let messageContent = {};
    switch (mtype) {
      case "imageMessage":
        messageContent = {
          image: buffer,
          caption: match.quoted.text || '',
          mimetype: match.quoted.mimetype || "image/jpeg"
        };
        break;

      case "videoMessage":
        messageContent = {
          video: buffer,
          caption: match.quoted.text || '',
          mimetype: match.quoted.mimetype || "video/mp4"
        };
        break;

      case "audioMessage":
        messageContent = {
          audio: buffer,
          mimetype: "audio/mp4",
          ptt: match.quoted.ptt || false
        };
        break;

      default:
        return await client.sendMessage(
          from,
          { text: "❌ Only *image*, *video*, and *audio* messages are supported!" },
          { quoted: message }
        );
    }

    // Forward recovered message with newsletter style
    await client.sendMessage(
      from,
      {
        image: { url: BOT_IMAGE },
        caption: `✅ *Recovered View-Once Message*\n━━━━━━━━━━━━━━━━━━━\n\n${mtype.replace("Message", "").toUpperCase()} has been unlocked!\n\n──────────────\n${BOT_NAME}`,
        contextInfo: {
          forwardingScore: 999,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: "120363418305362813@newsletter",
            newsletterName: BOT_NAME,
            serverMessageId: "",
          },
        },
      },
      { quoted: message }
    );

    // Send original media to owner's DM
    await client.sendMessage(message.sender, messageContent, options);

  } catch (error) {
    console.error("vv2 Error:", error);
    await client.sendMessage(
      from,
      {
        text: `❌ Error fetching vv message:\n${error.message}`
      },
      { quoted: message }
    );
  }
});