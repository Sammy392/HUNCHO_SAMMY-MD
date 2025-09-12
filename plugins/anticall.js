const fs = require('fs');
const path = require('path');
const config = require('../config');
const { cmd } = require('../command');

const settingsPath = path.join(__dirname, '../config.js');

cmd({
  pattern: 'anticall',
  desc: 'Toggle auto call reject on or off',
  use: '.anticall',
  category: 'privacy',
  filename: __filename
}, async (cmd, mek, m, { reply, isOwner }) => {
  if (!isOwner) return reply('❌ Owner only command.');

  try {
    // Toggle value
    config.ANTI_CALL = config.ANTI_CALL === 'true' ? 'false' : 'true';

    // Update settings.js
    let settingsText = fs.readFileSync(settingsPath, 'utf-8');
    settingsText = settingsText.replace(/ANTI_CALL\s*:\s*["'](true|false)["']/,
      `ANTI_CALL: "${config.ANTI_CALL}"`);
    fs.writeFileSync(settingsPath, settingsText);

    const status = config.ANTI_CALL === 'true' ? '✅ Enabled' : '❌ Disabled';
    reply(`*📞 Anti-Call mode is now:* ${status}`);
  } catch (err) {
    console.error(err);
    reply('❌ Failed to toggle anti-call setting.');
  }
});
