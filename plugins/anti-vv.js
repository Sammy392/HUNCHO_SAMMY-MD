const { cmd } = require("../command");

const BOT_NAME = "⚡ HUNCHO BOT";
const BOT_IMAGE = "https://i.ibb.co/rfvKLDfp/popkid.jpg";

cmd({
  pattern: "vv",
  alias: ["viewonce", "retrive"],
  react: "🐳",
  desc: "Owner Only - retrieve quoted view-once message",
  category: "owner",
  filename: __filename
}, async (client, message, match, { from, isCreator }) => {
  try {
    if (!isCreator) {
      return await client.sendMessage(
        from,
        {
          text: "📛 *This is an owner-only command.*\n\n🔒 Access Denied!",
        },
        { quoted: message }
      );
    }

    if (!match.quoted) {
      return await client.sendMessage(
        from,
        {
          text: "🍁 *Please reply to a view-once message (image, video, or audio).*",
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
          caption: match.quoted.text || "",
          mimetype: match.quoted.mimetype || "image/jpeg",
        };
        break;

      case "videoMessage":
        messageContent = {
          video: buffer,
          caption: match.quoted.text || "",
          mimetype: match.quoted.mimetype || "video/mp4",
        };
        break;

      case "audioMessage":
        messageContent = {
          audio: buffer,
          mimetype: "audio/mp4",
          ptt: match.quoted.ptt || false,
        };
        break;

      default:
        return await client.sendMessage(
          from,
          {
            text: "❌ *Only image, video, and audio view-once messages are supported!*",
          },
          { quoted: message }
        );
    }

    // ✨ Attractive confirmation with newsletter style
    const caption = 
`🔓 *View-Once Message Unlocked!*
━━━━━━━━━━━━━━━━━━━
📂 Type: *${mtype.replace("Message", "").toUpperCase()}*
💬 Status: *Successfully Retrieved*
━━━━━━━━━━━━━━━━━━━
⚡ Delivered by ${BOT_NAME}`;

    await client.sendMessage(
      from,
      {
        image: { url: BOT_IMAGE },
        caption,
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

    // 🎯 Finally, send the actual unlocked media
    await client.sendMessage(from, messageContent, options);

    // React with unlock emoji 🔓
    await client.sendMessage(from, { react: { text: "🔓", key: message.key } });

  } catch (error) {
    console.error("vv Error:", error);
    await client.sendMessage(
      from,
      {
        text: `❌ *Error while retrieving view-once message:*\n${error.message}`,
      },
      { quoted: message }
    );
  }
});