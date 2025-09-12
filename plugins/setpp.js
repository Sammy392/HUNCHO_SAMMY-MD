const { cmd } = require("../command");
const Jimp = require("jimp");

cmd({
  pattern: "fullpp",
  alias: ["setpp", "setdp", "pp"],
  desc: "Set a full image as bot's profile picture",
  react: "🖼️",
  category: "tools",
  filename: __filename,
}, async (cmd, m, match, { from, isCreator }) => {
  try {
    const botJid = cmd.user?.id?.split(":")[0] + "@s.whatsapp.net";

    // Restrict usage
    if (m.sender !== botJid && !isCreator) {
      return await cmd.sendMessage(from, {
        text: `╔══✦══╗
🚫 *Access Denied!*  
Only *Owner* or *Bot* can set profile picture.
╚══✦══╝`
      }, { quoted: m });
    }

    // Require quoted image
    if (!m.quoted || !m.quoted.mtype?.includes("image")) {
      return await cmd.sendMessage(from, {
        text: `⚠️ *Please reply with an image!*  
Use this command on a photo you want as the new *Profile Picture*.`
      }, { quoted: m });
    }

    // Notify user
    await cmd.sendMessage(from, {
      text: `🖼️ *Processing Image...*  
Please wait while I set a fresh *Profile Picture* ✨`
    }, { quoted: m });

    // Handle Image
    const mediaBuffer = await m.quoted.download();
    const image = await Jimp.read(mediaBuffer);

    // Stylish resize & blur
    const blurred = image.clone().cover(640, 640).blur(8);
    const centered = image.clone().contain(640, 640);
    blurred.composite(centered, 0, 0);

    const processedImage = await blurred.getBufferAsync(Jimp.MIME_JPEG);

    // Apply new profile picture
    await cmd.updateProfilePicture(botJid, processedImage);

    // Success message
    await cmd.sendMessage(from, {
      text: `✅ *Profile Picture Updated!*  
Your bot is now looking *extra fresh* 🔥`
    }, { quoted: m });

  } catch (err) {
    console.error("FullPP Error:", err);
    await cmd.sendMessage(from, {
      text: `❌ *Failed to update profile picture!*  
🪲 Error: \`${err.message}\``
    }, { quoted: m });
  }
});
