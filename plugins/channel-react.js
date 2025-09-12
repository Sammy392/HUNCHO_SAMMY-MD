const { cmd } = require("../command");

// ========= GLOBAL SETTINGS ==========
const BOT_NAME = "⚡ HUNCHO";
const BOT_IMAGE = "https://i.ibb.co/rfvKLDfp/popkid.jpg";
const NEWSLETTER_ID = "120363418305362813@newsletter";

const stylizedChars = {
    a: '🅐', b: '🅑', c: '🅒', d: '🅓', e: '🅔', f: '🅕', g: '🅖',
    h: '🅗', i: '🅘', j: '🅙', k: '🅚', l: '🅛', m: '🅜', n: '🅝',
    o: '🅞', p: '🅟', q: '🅠', r: '🅡', s: '🅢', t: '🅣', u: '🅤',
    v: '🅥', w: '🅦', x: '🅧', y: '🅨', z: '🅩',
    '0': '⓿', '1': '➊', '2': '➋', '3': '➌', '4': '➍',
    '5': '➎', '6': '➏', '7': '➐', '8': '➑', '9': '➒'
};

// 🖼️ Fancy Caption Formatter
function fancyBox(title, body, footer = BOT_NAME) {
    return `
╭━━━〔 ${title} 〕━━━┈⊷
${body.split("\n").map(line => `┃ ${line}`).join("\n")}
╰━━━━━━━━━━━━━━━━━━┈⊷
> ✦ ${footer}`;
}

// 🚀 Styled Send Function
async function sendFancy(conn, chatId, m, { title, body }) {
    await conn.sendMessage(
        chatId,
        {
            image: { url: BOT_IMAGE },
            caption: fancyBox(title, body),
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: NEWSLETTER_ID,
                    newsletterName: BOT_NAME,
                    serverMessageId: "",
                },
            },
        },
        { quoted: m }
    );
}

// ========= COMMAND ==========
cmd({
    pattern: "ch",
    alias: ["chreact"],
    react: "💫",
    desc: "React to channel messages with stylized fancy text",
    category: "owner",
    use: ".ch <channel-link> <text>",
    filename: __filename
},
async (conn, mek, m, { from, q, isCreator, command }) => {
    try {
        if (!isCreator) return sendFancy(conn, from, m, {
            title: "🚫 OWNER ONLY",
            body: "📛 You are not authorized to use this command."
        });

        if (!q) return sendFancy(conn, from, m, {
            title: "⚠️ USAGE",
            body: `💡 Example:\n${command} https://whatsapp.com/channel/1234567890 hello`
        });

        const [link, ...textParts] = q.split(" ");
        if (!link.includes("whatsapp.com/channel/")) return sendFancy(conn, from, m, {
            title: "❌ ERROR",
            body: "⚠️ Invalid channel link format."
        });
        
        const inputText = textParts.join(" ").toLowerCase();
        if (!inputText) return sendFancy(conn, from, m, {
            title: "❌ ERROR",
            body: "⚠️ Please provide text to convert."
        });

        // Stylize text
        const emoji = inputText
            .split("")
            .map(char => (char === " " ? "―" : (stylizedChars[char] || char)))
            .join("");

        // Extract IDs
        const channelId = link.split("/")[4];
        const messageId = link.split("/")[5];
        if (!channelId || !messageId) return sendFancy(conn, from, m, {
            title: "❌ ERROR",
            body: "⚠️ Invalid link - missing channel or message ID."
        });

        // React to channel
        const channelMeta = await conn.newsletterMetadata("invite", channelId);
        await conn.newsletterReactMessage(channelMeta.id, messageId, emoji);

        // Success response
        return sendFancy(conn, from, m, {
            title: "✅ REACTION SENT",
            body: `📡 *Channel:* ${channelMeta.name}\n💬 *Reaction:* ${emoji}\n\n✨ Powered by ${BOT_NAME}`
        });

    } catch (e) {
        console.error(e);
        sendFancy(conn, from, m, {
            title: "❌ ERROR",
            body: `⚠️ Failed to send reaction:\n${e.message}`
        });
    }
});