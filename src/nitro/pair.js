import axios from 'axios';
import config from '../../config.cjs';

const sessionGen = async (m, sock) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim();
  const senderName = m.pushName || 'User';

  if (cmd !== 'pair') return;

  if (!text || !/^\+?\d{9,15}$/.test(text)) {
    await sock.sendMessage(m.from, {
      text: `❌ *Invalid Format!*\n\n✅ Example: *.pair +254712345678*`,
      contextInfo: {
        forwardingScore: 5,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterName: "Popkid-Xmd",
          newsletterJid: "120363420342566562@newsletter",
        },
      },
    }, { quoted: m });
    return;
  }

  try {
    const response = await axios.get(`https://popkidglesession.onrender.com/pair?number=${encodeURIComponent(text)}`);
    const { code } = response.data;

    if (!code) throw new Error("No code returned");

    await sock.sendMessage(m.from, {
      image: { url: 'https://files.catbox.moe/959dyk.jpg' },
      caption: `✅ *Pairing Code Generated!*\n\n👤 Number: ${text}\n🔐 Code: *${code}*\n\nUse this on your bot panel or CLI to connect the number.`,
      contextInfo: {
        forwardingScore: 5,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterName: "Popkid-Xmd",
          newsletterJid: "120363420342566562@newsletter",
        },
      },
    }, { quoted: m });
  } catch (err) {
    console.error(err);
    await sock.sendMessage(m.from, {
      text: `❌ *Failed to generate pairing code.*\n\nReason: ${err.response?.data?.error || err.message}`,
      contextInfo: {
        forwardingScore: 5,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterName: "Popkid-Xmd",
          newsletterJid: "120363420342566562@newsletter",
        },
      },
    }, { quoted: m });
  }
};

export default sessionGen;
