const huncho = async (m, gss) => {
  try {
    const prefix = config.PREFIX;
    const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';

    if (cmd !== 'huncho') return;

    await gss.sendMessage(m.from, {
      text: `┏━━━〔 👑 *Huncho Speaks* 〕━━━┓
┃
┃  Hello, it's *Huncho*, the creator.
┃  The strongest in *eFootball*!
┃  Always the *lucky one*.
┃
┃  #LOVE IS A SCAM 💔
┃
┗━━━━━━━━━━━━━━━━━━━━┛`,
      contextInfo: {
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363290715861418@newsletter',
          newsletterName: 'Popkid-Xmd'
        }
      }
    });

  } catch (err) {
    console.error('Huncho Command Error:', err);
    await gss.sendMessage(m.from, {
      text: `❌ Something went wrong while executing .huncho`,
      contextInfo: {
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363290715861418@newsletter',
          newsletterName: 'Popkid-Xmd'
        }
      }
    });
  }
};

export default huncho;
