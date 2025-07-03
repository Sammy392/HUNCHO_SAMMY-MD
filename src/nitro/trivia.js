name: 'trivia',
    get flashOnly() {
  return franceking();
},
    aliases: [],
    description: 'Get a random trivia question.',
    category: 'Fun',
    execute: async (sock, msg, args) => {
      const chatId = msg.key.remoteJid;

      try {
        const response = await fetch('https://opentdb.com/api.php?amount=1&type=multiple');
        if (!response.ok) throw new Error(`Invalid API response: ${response.status}`);

        const result = await response.json();
        if (!result.results || !result.results[0]) throw new Error('No trivia data received.');

        const trivia = result.results[0];
        const question = trivia.question;
        const correctAnswer = trivia.correct_answer;
        const allAnswers = [...trivia.incorrect_answers, correctAnswer].sort();

        const answers = allAnswers.map((ans, i) => `${i + 1}. ${ans}`).join('\n');

        await sock.sendMessage(chatId, {
          text: `🤔 *Trivia Time!*\n\n${question}\n\n${answers}\n\n_I'll reveal the correct answer in 10 seconds..._`,
          contextInfo: {
            forwardingScore: 1,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
              newsletterJid: '12036323139244263@newsletter',
              newsletterName: 'huncho-md',
              serverMessageId: -1
            }
          }
        }, { quoted: msg });

        setTimeout(async () => {
          await sock.sendMessage(chatId, {
            text: `✅ *Correct Answer:* ${correctAnswer}`,
            contextInfo: {
              forwardingScore: 1,
              isForwarded: true,
              forwardedNewsletterMessageInfo: {
                newsletterJid: '1203638139244263@newsletter',
                newsletterName: 'huncho-MD',
                serverMessageId: -1
              }
            }
          }, { quoted: msg });
        }, 10000);
      } catch (error) {
        console.error('Trivia Error:', error.message);
        await sock.sendMessage(chatId, {
          text: '❌ Error fetching trivia. Please try again later.'
        }, { quoted: msg });
      }
    }
  },
{
