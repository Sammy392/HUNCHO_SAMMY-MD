name: 'jokes',
    get flashOnly() {
  return franceking();
},
    aliases: [],
    description: 'Get a random joke.',
    category: 'Fun',
    execute: async (sock, msg, args) => {
      const chatId = msg.key.remoteJid;

      try {
        const response = await fetch('https://api.popcat.xyz/joke');
        if (!response.ok) throw new Error('Network response was not ok.');
        const data = await response.json();

        await sock.sendMessage(chatId, {
          text: data.joke,
          contextInfo: {
            forwardingScore: 1,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
              newsletterJid: '1203632339244263@newsletter',
              newsletterName: 'Huncho-MD',
              serverMessageId: -1
            }
          }
        }, { quoted: msg });
      } catch (error) {
        console.error('Error fetching joke:', error.message);
        await sock.sendMessage(chatId, {
          text: '❌ Failed to fetch a joke. Please try again later.'
        }, { quoted: msg });
      }
    }
  },
          {
