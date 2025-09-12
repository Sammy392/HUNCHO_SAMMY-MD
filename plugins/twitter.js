const axios = require('axios');
const { cmd } = require('../command');

cmd({
    pattern: 'twitter',
    alias: ['tweet', 'twdl'],
    desc: 'download twitter videos 📹',
    category: 'download',
    filename: __filename
}, async (cmd, m, mek, { from, args, quoted, reply }) => {
    try {
        const twitterUrl = args[0];
        if (!twitterUrl || !twitterUrl.startsWith('https://')) {
            return reply('❎ please provide a valid twitter url 🔗');
        }

        await cmd.sendMessage(from, { react: { text: '⏳', key: m.key } });

        const response = await axios.get(`https://www.dark-yasiya-api.site/download/twitter?url=${encodeURIComponent(twitterUrl)}`);
        const data = response.data;

        if (!data?.status || !data.result) {
            return reply('❎ failed to fetch twitter video 😔');
        }

        const { desc = 'no description 📝', thumb, video_sd, video_hd } = data.result;

        const caption = `
╭───〔 *huncho xᴛʀ* 〕──┈⊷
┃▸╭───────────
┃▸┊๏ *ᴛᴡɪᴛᴛᴇʀ ᴅʟ* 📹
┃▸╰───────────···๏
╰────────────────┈⊷
╭──┈┈┈┈┈┈┈┈┈──⚡
┇๏ *ᴅᴇsᴄ* - ${desc} 📝
┇๏ *ᴠɪᴅᴇᴏ ᴏᴘᴛɪᴏɴs* 🎥:
┇  1️⃣ *sᴅ ǫᴜᴀʟɪᴛʏ* 📼
┇  2️⃣ *ʜᴅ ǫᴜᴀʟɪᴛʏ* 🌟
╰──┈┈┈┈┈┈┈┈┈──⚡
> *ᴍᴀᴅᴇ ʙʏ huncho*
↪️ *reply with 1 or 2 to download* 🚀`;

        const sentMsg = await cmd.sendMessage(from, {
            image: { url: thumb },
            caption
        }, { quoted: mek });

        cmd.ev.on('messages.upsert', async ({ messages }) => {
            const receivedMsg = messages[0];
            if (!receivedMsg.message) return;

            const text = receivedMsg.message.conversation || receivedMsg.message.extendedTextMessage?.text;
            const isReplyTo = receivedMsg.message.extendedTextMessage?.contextInfo?.stanzaId === sentMsg.key.id;
            if (!isReplyTo) return;

            try {
                await cmd.sendMessage(from, { react: { text: '⬇️', key: receivedMsg.key } });

                const videoUrl = text === '1' ? video_sd : text === '2' ? video_hd : null;
                if (!videoUrl) {
                    return reply('❎ invalid choice, reply with 1 or 2 😕');
                }

                await cmd.sendMessage(from, {
                    video: { url: videoUrl },
                    caption: `📥 *downloaded in ${text === '1' ? 'sd' : 'hd'} quality* 🎉`
                }, { quoted: receivedMsg });

                await cmd.sendMessage(from, { react: { text: '✅', key: receivedMsg.key } });

            } catch (err) {
                console.error('❌ download error:', err);
                await reply('❎ failed to download video 😞');
            }
        });

    } catch (err) {
        console.error('❌ error:', err);
        await cmd.sendMessage(from, { react: { text: '❌', key: m.key } });
        await reply('❎ error processing twitter url 🚫');
    }
});
