const { cmd } = require('../command');
const axios = require('axios');

/**
 * 🤖 General AI Command
 */
cmd({
    pattern: "ai",
    alias: ["bot", "dj", "gpt", "gpt4", "bing"],
    desc: "Chat with an AI model",
    category: "AI",
    react: "🤖",
    filename: __filename
},
async (conn, mek, m, { q, reply, react }) => {
    try {
        if (!q) return reply("⚡ *Usage:* `.ai Hello`");

        const apiUrl = `https://lance-frank-asta.onrender.com/api/gpt?q=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);

        if (!data?.message) {
            await react("❌");
            return reply("🚫 AI is taking a nap... try again later!");
        }

        const caption = 
`╭───🤖 *AI Model* ───╮
│  
│ 💬 ${data.message}
│  
╰──────────────────╯`;

        await conn.sendMessage(
            m.from,
            {
                image: { url: "https://i.ibb.co/rfvKLDfp/popkid.jpg" }, // 🔗 you can replace with your bot logo/profile
                caption,
                contextInfo: {
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363418305362813@newsletter',
                        newsletterName: '🤖 HUNCHO',
                        serverMessageId: '',
                    },
                },
            },
            { quoted: m }
        );
        await react("✅");

    } catch (e) {
        console.error("❌ Error in AI command:", e);
        await react("❌");
        reply("⚠️ Oops! Something went wrong with AI.");
    }
});

/**
 * 🧠 OpenAI Command
 */
cmd({
    pattern: "openai",
    alias: ["chatgpt", "gpt3", "open-gpt"],
    desc: "Chat with OpenAI",
    category: "AI",
    react: "🧠",
    filename: __filename
},
async (conn, mek, m, { q, reply, react }) => {
    try {
        if (!q) return reply("⚡ *Usage:* `.openai Hello`");

        const apiUrl = `https://vapis.my.id/api/openai?q=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);

        if (!data?.result) {
            await react("❌");
            return reply("🚫 OpenAI is unavailable, please retry.");
        }

        const caption = 
`🧠 *OpenAI Response*
━━━━━━━━━━━━━━━━━━━
📜 ${data.result}
━━━━━━━━━━━━━━━━━━━`;

        await conn.sendMessage(
            m.from,
            {
                image: { url: "https://i.ibb.co/rfvKLDfp/popkid.jpg" }, // custom OpenAI-themed image
                caption,
                contextInfo: {
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363418305362813@newsletter',
                        newsletterName: '🧠 HUNCHO',
                        serverMessageId: '',
                    },
                },
            },
            { quoted: m }
        );
        await react("✅");

    } catch (e) {
        console.error("❌ Error in OpenAI command:", e);
        await react("❌");
        reply("⚠️ Error occurred while contacting OpenAI.");
    }
});

/**
 * 🔮 DeepSeek Command
 */
cmd({
    pattern: "deepseek",
    alias: ["deep", "seekai"],
    desc: "Chat with DeepSeek AI",
    category: "AI",
    react: "🔮",
    filename: __filename
},
async (conn, mek, m, { q, reply, react }) => {
    try {
        if (!q) return reply("⚡ *Usage:* `.deepseek Hello`");

        const apiUrl = `https://api.ryzendesu.vip/api/ai/deepseek?text=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);

        if (!data?.answer) {
            await react("❌");
            return reply("🚫 DeepSeek is silent right now...");
        }

        const caption = 
`🔮✨ *DeepSeek Oracle* ✨🔮

「 ${data.answer} 」

───────────────`;

        await conn.sendMessage(
            m.from,
            {
                image: { url: "https://files.catbox.moe/tbdd5d.jpg" }, // mystical theme pic
                caption,
                contextInfo: {
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363418305362813@newsletter',
                        newsletterName: '🔮 HUNCHO',
                        serverMessageId: '',
                    },
                },
            },
            { quoted: m }
        );
        await react("✅");

    } catch (e) {
        console.error("❌ Error in DeepSeek command:", e);
        await react("❌");
        reply("⚠️ Error occurred while contacting DeepSeek AI.");
    }
});