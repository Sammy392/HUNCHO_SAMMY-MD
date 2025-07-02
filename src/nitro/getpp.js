import config from '../../config.cjs';

const profile = async (m, sock) => {
  const prefix = config.PREFIX;
  const command = m.body.startsWith(prefix)
    ? m.body.slice(prefix.length).split(' ')[0].toLowerCase()
    : '';

  const text = m.body.slice(prefix.length + command.length).trim();

  if (command !== 'getpp') return;

  let jid;

  // Auto-detect from text (number, @mention), quoted message, or fallback
  if (/^\d{7,15}$/.test(text)) {
    // Pure number, no @, no + — add domain
    jid = `${text}@s.whatsapp.net`;
  } else if (text.includes('@')) {
    // Mention (e.g. @2547xxxxxxx) — clean and append
    const clean = text.replace(/[@+]/g, '');
    jid = `${clean}@s.whatsapp.net`;
  } else if (m.mentionedJid?.length) {
    jid = m.mentionedJid[0];
  } else if (m.quoted?.sender) {
    jid = m.quoted.sender;
  } else {
    return sock.sendMessage(m.from, {
      text: `📸 *Please provide a WhatsApp number or mention someone.*\n\n📌 *Examples:*\n• \`${prefix}getpp 2547xxxxxxxx\`\n• \`${prefix}getpp @user\`\n• Or just reply to a user's message.`,
    }, { quoted: m });
  }

  await sock.sendMessage(m.from, { react: { text: '🔍', key: m.key } });

  try {
    const ppUrl = await sock.profilePictureUrl(jid, 'image');

    if (!ppUrl) {
      return sock.sendMessage(m.from, {
        text: `🚫 *No profile picture found for:* \`${jid.split('@')[0]}\``
      }, { quoted: m });
    }

    const caption = `
╭───⟪ *Profile Info* ⟫───
│
│ 👤 *User:* ${jid.split('@')[0]}
│ 🖼️ *Profile Picture Below*
│
╰───────────────⟡
    `.trim();

    await sock.sendMessage(m.from, {
      image: { url: ppUrl },
      caption
    }, { quoted: m });

    await sock.sendMessage(m.from, { react: { text: '✅', key: m.key } });

  } catch (err) {
    console.error('[GetPP Error]', err.message);
    await sock.sendMessage(m.from, {
      text: `❌ *Error fetching profile picture.*\nMake sure the number is valid and registered on WhatsApp.`
    }, { quoted: m });
    await sock.sendMessage(m.from, { react: { text: '⚠️', key: m.key } });
  }
};

export default profile;
