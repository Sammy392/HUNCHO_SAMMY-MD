const { cmd } = require('../command');
const axios = require('axios');

/**
 * 🤖 Meta AI Command
 */
cmd({
    pattern: "metaai",
    alias: ["xeon", "meta"],
    react: "🤖",
    desc: "Talk with Meta AI",
    category: "AI",
    use: '.metaai <your question>',
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("⚡ *Usage:* `.metaai Hello`");

        // React: Processing
        await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

        // Show "typing" presence
        await conn.sendPresenceUpdate("composing", from);

        // Fetch AI response
        const { data } = await axios.get(
            `https://apis.davidcyriltech.my.id/ai/metaai?text=${encodeURIComponent(q)}`
        );

        if (!data.success || !data.response) {
            await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
            return reply("🚫 Meta AI failed to respond. Try again later.");
        }

        // React: Success
        await conn.sendMessage(from, { react: { text: '✅', key: m.key } });

        // Styled response
        const caption = 
`🌐 *Meta AI Response*
━━━━━━━━━━━━━━━━━━━
💬 ${data.response}
━━━━━━━━━━━━━━━━━━━`;

        // Forwarded Newsletter style message
        await conn.sendMessage(
            from,
            {
                image: { url: "https://i.ibb.co/rfvKLDfp/popkid.jpg" }, // Meta AI themed image/logo
                caption,
                contextInfo: {
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363418305362813@newsletter',
                        newsletterName: '🌐 HUNCHOBOT',
                        serverMessageId: '',
                    },
                },
            },
            { quoted: m }
        );

    } catch (e) {
        console.error("MetaAI Error:", e);
        await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
        reply("⚠️ An error occurred while communicating with Meta AI.");
    }
});