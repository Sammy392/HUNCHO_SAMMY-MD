const axios = require('axios');
const { cmd } = require('../command');

cmd({
    pattern: 'img',
    alias: ['image', 'googleimage', 'searchimg'],
    react: '🖼️',
    desc: 'search google images 📷',
    category: 'download',
    use: '.img <keywords>',
    filename: __filename
}, async (malvin, mek, m, { reply, args, from }) => {
    try {
        const query = args.join(' ');
        if (!query) {
            return reply('❌ please provide a search query\nexample: .img cute cats');
        }

        await malvin.sendMessage(from, { react: { text: '⏳', key: m.key } });
        await reply(`🔍 searching for *${query}*...`);

        const url = `https://apis.davidcyriltech.my.id/googleimage?query=${encodeURIComponent(query)}`;
        const response = await axios.get(url, { timeout: 15000 });

        if (!response.data?.success || !response.data.results?.length) {
            await reply('❌ no images found 😔\ntry different keywords');
            await malvin.sendMessage(from, { react: { text: '❌', key: m.key } });
            return;
        }

        const results = response.data.results;
        const maxImages = Math.min(results.length, 5);
        await reply(`✅ found *${results.length}* images for *${query}*\nsending top ${maxImages}...`);

        const selectedImages = results
            .sort(() => 0.5 - Math.random())
            .slice(0, maxImages);

        for (const [index, imageUrl] of selectedImages.entries()) {
            try {
                const caption = `
╭───[ *ɪᴍᴀɢᴇ sᴇᴀʀᴄʜ* ]───
├ *ǫᴜᴇʀʏ*: ${query} 🔍
├ *ʀᴇsᴜʟᴛ*: ${index + 1} of ${maxImages} 🖼️
╰───[ *huncho xtr* ]───
> *powered by huncho* ♡`;

                await cmd.sendMessage(
                    from,
                    {
                        image: { url: imageUrl },
                        caption,
                        contextInfo: { mentionedJid: [m.sender] }
                    },
                    { quoted: mek }
                );
            } catch (err) {
                console.warn(`⚠️ failed to send image ${index + 1}: ${imageUrl}`, err);
                continue;
            }

            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        await cmd.sendMessage(from, { react: { text: '✅', key: m.key } });

    } catch (error) {
        console.error('❌ image search error:', error);
        const errorMsg = error.message.includes('timeout')
            ? '❌ request timed out ⏰'
            : '❌ failed to fetch images 😞';
        await reply(errorMsg);
        await cmd.sendMessage(from, { react: { text: '❌', key: m.key } });
    }
});
