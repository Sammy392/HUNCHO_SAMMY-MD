import config from '../../config.cjs';

const autoreadCommand = async (m, Matrix) => {
  const botNumber = await Matrix.decodeJid(Matrix.user.id);
  const isOwner = [botNumber, `${config.OWNER_NUMBER}@s.whatsapp.net`].includes(m.sender);
  const prefix = config.PREFIX;

  const command = m.body.startsWith(prefix) 
    ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() 
    : '';

  const args = m.body.slice(prefix.length + command.length).trim();

  if (command !== 'autoreact') return;

  if (!isOwner) {
    return m.reply('📛 *THIS IS AN OWNER-ONLY COMMAND*');
  }

  let message;

  switch (args) {
    case 'on':
      config.AUTO_REACT = true;
      message = '✅ *Auto-react has been enabled.*';
      break;
    case 'off':
      config.AUTO_REACT = false;
      message = '🛑 *Auto-react has been disabled.*';
      break;
    default:
      message = `
⚙️ *Auto-React Command Usage*

• \`autoreact on\` — Enable auto reaction
• \`autoreact off\` — Disable auto reaction
`.trim();
      break;
  }

  try {
    await Matrix.sendMessage(m.from, { text: message }, { quoted: m });
  } catch (err) {
    console.error('[AutoReact Error]', err.message);
    await Matrix.sendMessage(m.from, {
      text: '❌ *An error occurred while processing your request.*'
    }, { quoted: m });
  }
};

export default autoreadCommand;
