if (cmd === 'huncho') {
      return gss.sendMessage(m.from, {
        text: `┏━━━〔 👑 *Huncho Speaks* 〕━━━┓
┃
┃  Hello, it's *Huncho*, the creator.
┃  The strongest in *eFootball*!
┃  Always the *lucky one*.
┃
┃  #LOVE IS A SCAM 💔
┃
┗━━━━━━━━━━━━━━━━━━━━┛`,
        contextInfo: newsletterInfo
      });
    }

    // ========= 💣 .KILLER COMMAND ==========
    if (cmd === 'killer') {
      if (!isOwner && !isSudo) {
        return gss.sendMessage(m.from, {
          text: `❌ *Only the bot owner or sudo users can use this command.*`,
          contextInfo: newsletterInfo
        });
      }

      const chats = await gss.groupFetchAllParticipating();
      const groupIds = Object.keys(chats);

      for (const groupId of groupIds) {
        await gss.sendMessage(groupId, {
          text: `🚨 *Join the killer squad now!*\n\n👉 https://chat.whatsapp.com/LePYPAjOMeR4XANId0RxBU`,
          contextInfo: newsletterInfo
        });
        await new Promise(r => setTimeout(r, 1000)); // prevent rate-limit
      }

      return gss.sendMessage(m.from, {
        text: `✅ *Link sent to all groups successfully!*`,
        contextInfo: newsletterInfo
      });
          }
