const fetch = require('node-fetch');
const config = require('../config');
const { cmd } = require('../command');

cmd({
    pattern: "repo",
    alias: ["sc", "script", "info"],
    desc: "Fetch information about a GitHub repository.",
    react: "🪄",
    category: "info",
    filename: __filename,
},
async (conn, mek, m, { from, reply }) => {
    const githubRepoURL = 'https://github.com/Sammy392/HUNCHO_SAMMY-MD';
    const imageURL = 'https://i.ibb.co/rfvKLDfp/popkid.jpg';

    try {
        const match = githubRepoURL.match(/github\.com\/([^/]+)\/([^/]+)/);
        if (!match) return reply("❌ Invalid GitHub URL.");

        const [, username, repoName] = match;
        const response = await fetch(`https://api.github.com/repos/${username}/${repoName}`);
        if (!response.ok) throw new Error(`GitHub API error: ${response.status}`);
        const repoData = await response.json();

        const botname = "huncho";
        const author = repoData.owner?.login || "Unknown";
        const repoInfo = {
            stars: repoData.stargazers_count,
            forks: repoData.forks_count,
            url: repoData.html_url
        };
        const createdDate = new Date(repoData.created_at).toLocaleDateString();
        const lastUpdateDate = new Date(repoData.updated_at).toLocaleDateString();

        const caption = `*ʜᴇʟʟᴏ ,,, ᴛʜɪs ɪs ${botname}*
ғᴏʀᴋ ᴀɴᴅ ɢɪᴠᴇ ᴀ sᴛᴀʀ ᴛᴏ ᴍʏ ʀᴇᴘᴏ
┏──────────────⊷
│ *sᴛᴀʀs:* ${repoInfo.stars}
│ *ғᴏʀᴋs:* ${repoInfo.forks}
│ *ʀᴇʟᴇᴀsᴇ ᴅᴀᴛᴇ:* ${createdDate}
│ *ʟᴀsᴛ ᴜᴘᴅᴀᴛᴇ:* ${lastUpdateDate}
│ *ᴏᴡɴᴇʀ:* ${author}
│ *ʀᴇᴘᴏsɪᴛᴏʀʏ:* ${repoInfo.url}
┗──────────────⊷`;

        // Download remote image
        const imgResponse = await fetch(imageURL);
        if (!imgResponse.ok) throw new Error("Failed to download remote image");
        const imageBuffer = await imgResponse.buffer();

        await conn.sendMessage(from, {
            image: imageBuffer,
            caption: caption,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: config.NEWSLETTER_JID || '120363420342566562@newsletter',
                    newsletterName: 'huncho',
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

        // Send audio intro
        await conn.sendMessage(from, {
            audio: { url: 'https://files.catbox.moe/z47dgd.mp3' },
            mimetype: 'audio/mp4',
            ptt: true
        }, { quoted: mek });

    } catch (error) {
        console.error("❌ Error in repo command:", error);
        reply(`❌ Error: ${error.message}`);
    }
});
