name: 'best-wallp',
    get flashOnly() {
  return franceking();
},
    aliases: ['bestwal', 'best', 'bw'],
    description: 'Sends a high-quality random wallpaper.',
    category: 'HUNCHO PICS',
    execute: async (sock, msg) => {
      const chatId = msg.key.remoteJid;
      try {
        const { data } = await axios.get('https://api.unsplash.com/photos/random?client_id=72utkjatCBC-PDcx7-Kcvgod7-QOFAm2fXwEeW8b8cc');
        const url = data?.urls?.regular;
        if (!url) {
          return await sock.sendMessage(chatId, { text: "Couldn't fetch wallpaper. Try again later." }, { quoted: msg });
        }
        await sock.sendMessage(chatId, {
          image: { url },
          caption: "*POWERED BY HUNCHO-MD*",
          contextInfo: {
            forwardingScore: 1,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
              newsletterJid: '12036323813924263@newsletter',
              newsletterName: 'HunchoMD',
              serverMessageId: -1
            }
          }
        }, { quoted: msg });
      } catch (error) {
        console.error('Wallpaper Error:', error);
        await sock.sendMessage(chatId, { text: "An error occurred while fetching wallpaper." }, { quoted: msg });
      }
    }
  },
        {
