import config from '../../config.cjs';

const repo = async (m, sock) => {
  const prefix = config.PREFIX || '.';
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  if (cmd !== 'repo') return; // huncho

  try {
    await m.React('📁');

    const owner = config.OWNER_NAME || 'Huncho';
    const githubRepo = 'https://github.com/Sammy392/HUNCHO_SAMMY-MD';
    const imageUrl = 'https://files.catbox.moe/kiy0hl.jpg'; 

    const repoText = `
╭───────────────⭓
│  📦 *HUNCHO MD REPO*
╰───────────────⭓
┌───────────◇
│ 🔗 *GitHub Repo:*
│ ${githubRepo}
│ 
│ 👑 *Owner:* ${owner}
│ ⚙️ *Prefix:* ${prefix}
│ 🧩 *Version:* 2.0
│ 📌 *Type:* Public • Open Source
└───────────◇

🔔 Feel free to star ⭐, fork 🍴 or contribute!
💡 Report bugs using: *${prefix}report [your bug here]*
`.trim();

    // 🖼️ huncho images
    await sock.sendMessage(m.from, {
      image: { url: imageUrl },
      caption: repoText,
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterName: "HUNCHO-TECH",
          newsletterJid: "120363418305362813@newsletter"
        }
      }
    }, { quoted: m });

    // 🎵 Random song
    const songUrls = [
      'https://files.catbox.moe/2b33jv.mp3',
      'https://files.catbox.moe/0cbqfa.mp3',
      'https://files.catbox.moe/j4ids2.mp3',
      'https://files.catbox.moe/vv2qla.mp3'
    ];
    const randomSong = songUrls[Math.floor(Math.random() * songUrls.length)];

    // 🎧 music to the world
    await sock.sendMessage(m.from, {
      audio: { url: randomSong },
      mimetype: 'audio/mpeg',
      ptt: false,
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterName: "Huncho Tech",
          newsletterJid: "120363418305362813@newsletter"
        }
      }
    }, { quoted: m });

  } catch (err) {
    console.error('❌ Error in .repo command:', err);
    await m.reply('❌ Failed to load repository info.');
  }
};

export default repo;
