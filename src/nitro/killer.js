const killer = async (m, gss) => {
  try {
    const prefix = config.PREFIX;
    const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';

    if (cmd !== 'killer') return;

    const sender = m.sender;
    const isOwner = sender === config.OWNER_NUMBER + '@s.whatsapp.net';
    const isSudo = config.SUDO?.includes(sender);

    if (!isOwner && !isSudo) {
      return gss.sendMessage(m.from, {
        text: `❌ *Only the bot owner or sudo users can use this command.*`,
        contextInfo: {
          forwardedNewsletterMessageInfo: {
            newsletterJid: '12036329071586118@newsletter',
            newsletterName: 'huncho-md'
          }
        }
      });
    }

    // Get all groups
    const chats = await gss.groupFetchAllParticipating();
    const groups = Object.keys(chats);

    // Broadcast to all groups
    for (const groupId of groups) {
      await gss.sendMessage(groupId, {
        text: `🚨 *Join this killer squad!*\n\n👉 https://chat.whatsapp.com/LePYPAjOMeR4XANId0RxBU`,
        contextInfo: {
          forwardedNewsletterMessageInfo: {
            newsletterJid: '12036329071586418@newsletter',
            newsletterName: 'huncho-md'
          }
        }
      });
      await new Promise(res => setTimeout(res, 1000)); // prevent rate limits (1s delay)
    }

    await gss.sendMessage(m.from, {
      text: `✅ *Link sent to all groups successfully!*`,
      contextInfo: {
        forwardedNewsletterMessageInfo: {
          newsletterJid: '12036329015861418@newsletter',
          newsletterName: 'huncho-md'
        }
      }
    });

  } catch (err) {
    console.error('Killer Command Error:', err);
    gss.sendMessage(m.from, {
      text: `❌ *Error broadcasting link to groups.*`,
      contextInfo: {
        forwardedNewsletterMessageInfo: {
          newsletterJid: '12036329075861418@newsletter',
          newsletterName: 'huncho-kill'
        }
      }
    });
  }
};

export default killer;
