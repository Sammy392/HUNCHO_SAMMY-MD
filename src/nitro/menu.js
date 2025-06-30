import config from '../../config.cjs';

const menu = async (m, sock) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim();

  if (cmd === "menu") {
    const start = new Date().getTime();
    await m.React('🪆');
    const end = new Date().getTime();
    const responseTime = (end - start) / 1000;

    let profilePictureUrl = 'https://files.catbox.moe/kiy0hl.jpg'; // Default fallback image
    try {
      const pp = await sock.profilePictureUrl(m.sender, 'image');
      if (pp) profilePictureUrl = pp;
    } catch (err) {
      console.error("Couldn't fetch profile picture:", err);
    }

    const menuText = `
╔═══════════════✦
║ 👾 *𝗛𝗨𝗡𝗖𝗛𝗢 𝗠𝗗 𝗕𝗢𝗧* 👾
║ 💡 *Version:* 7.1.0
║ 🧠 *Developer:* Huncho🪆
║ ⚡ *Speed:* Ultra Fast
╚═══════════════✦

✨ *𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗦 𝗠𝗘𝗡𝗨* ✨
> Maximize your experience by using the commands below.

📁 *SYSTEM MENU*
• ${prefix}menu | 📜
• ${prefix}alive | ✅
• ${prefix}owner | 👑

🛠️ *OWNER COMMANDS*
• ${prefix}join | 🔗
• ${prefix}leave | 🚪
• ${prefix}autobio | 🩷
• ${prefix}block | 🔒
• ${prefix}unblock | 🔓
• ${prefix}autolikestatus | 🧋
• ${prefix}setppbot | 🤖
• ${prefix}anticall | 🚫
• ${prefix}setstatus | 🛑
• ${prefix}setnamebot | 📝

🧠 *GPT / AI FEATURES*
• ${prefix}ai | 🤖
• ${prefix}gpt | 🧠
• ${prefix}dalle | 🎨
• ${prefix}bug | 🐞
• ${prefix}report | 📢
• ${prefix}chatbot | 🗣️

📦 *CONVERTER TOOLS*
• ${prefix}attp | 🔤
• ${prefix}gimage | 🖼️
• ${prefix}play | 🎧
• ${prefix}video | 📹

🔍 *SEARCH UTILITIES*
• ${prefix}google | 🌐
• ${prefix}mediafire | 📦
• ${prefix}facebook | 📘
• ${prefix}instagram | 📸
• ${prefix}tiktok | 🎵
• ${prefix}lyrics | 🎶
• ${prefix}imdb | 🎬

🎉 *FUN ZONE*
• ${prefix}getpp | 🖼️
• ${prefix}url | 🔗

──────────────
🛠️ *Enjoy & Explore!*  
📌 _Bot by Huncho_
──────────────`;

    await sock.sendMessage(m.from, {
      image: { url: profilePictureUrl },
      caption: menuText.trim(),
      contextInfo: {
        forwardingScore: 5,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterName: "Huncho-Xmd",
          newsletterJid: "120363290715861418@newsletter",
        },
      }
    }, { quoted: m });
  }
};

export default menu;
