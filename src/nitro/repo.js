import config from '../../config.cjs';

const repo = async (m, sock) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix)
    ? m.body.slice(prefix.length).split(' ')[0].toLowerCase()
    : '';

  if (cmd !== 'repo') return;

  await m.React('📦');

  const github = 'https://github.com/Sammy392';
  const botRepo = 'https://github.com/Sammy392/HUNCHO_SAMMY-MD'; // Keep link unless repo is renamed

  const text = `
═══════════════════════
> 📦  *𝗛𝗨𝗡𝗖𝗛𝗢 𝗚𝗟𝗘 𝗥𝗘𝗣𝗢* 📦
> *Version:* 7.1.0 |
> *DEVELOPED BY HUNCHO🪆*
> *OPEN SOURCE 🔓*
═══════════════════════

_✨ *𝗚𝗜𝗧𝗛𝗨𝗕 𝗜𝗡𝗙𝗢* ✨_
> *Explore the Huncho GLE repository below!*

═══════════════════════
   🌍  *𝗥𝗘𝗣𝗢 𝗗𝗘𝗧𝗔𝗜𝗟𝗦* 🌍
═══════════════════════
| 👤 | GitHub: devpopkid
| 🔗 | ${botRepo}
| 🧠 | Language: Node.js (JavaScript)
| 📂 | Branch: main
═══════════════════════

═══════════════════════
   💻  *𝗜𝗡𝗦𝗧𝗔𝗟𝗟 𝗖𝗢𝗠𝗠𝗔𝗡𝗗* 💻
═══════════════════════
\`\`\`bash
git clone ${botRepo}
cd popkid-gle-bot
npm install && npm start
\`\`\`
═══════════════════════

✨ *Explore more on GitHub:*
🔗 ${github}

🔧 *Crafted with 💚 by Huncho Tech*
`;

  await sock.sendMessage(m.from, {
    image: { url: 'https://i.imgur.com/0y2bVbF.png' },
    caption: text.trim(),
    contextInfo: {
      forwardingScore: 5,
      isForwarded: true,
      externalAdReply: {
        title: "Huncho GLE WhatsApp Bot",
        body: "Open-source repo by Huncho",
        mediaType: 1,
        previewType: "PHOTO",
        renderLargerThumbnail: true,
        thumbnailUrl: "https://i.imgur.com/0y2bVbF.png",
        sourceUrl: botRepo
      }
    }
  }, { quoted: m });

  await m.React('✅');
};

export default repo;
