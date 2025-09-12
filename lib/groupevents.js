// ⚡ Advanced Group Events System (New Box Styles)
// by PopKid Devs 💖

const { isJidGroup } = require('@whiskeysockets/baileys');
const config = require('../config');

// Default profile pics
const ppUrls = [
    'https://i.ibb.co/KhYC4FY/1221bc0bdd2354b42b293317ff2adbcf-icon.png',
    'https://i.ibb.co/KhYC4FY/1221bc0bdd2354b42b293317ff2adbcf-icon.png',
    'https://i.ibb.co/KhYC4FY/1221bc0bdd2354b42b293317ff2adbcf-icon.png',
];

const GroupEvents = async (conn, update) => {
    try {
        if (!isJidGroup(update.id)) return;

        const metadata = await conn.groupMetadata(update.id);
        const participants = update.participants;
        const desc = metadata.desc || "✨ No group description set ✨";
        const groupMembersCount = metadata.participants.length;

        let ppUrl;
        try {
            ppUrl = await conn.profilePictureUrl(update.id, 'image');
        } catch {
            ppUrl = ppUrls[Math.floor(Math.random() * ppUrls.length)];
        }

        for (const num of participants) {
            const userName = num.split("@")[0];
            const timestamp = new Date().toLocaleString();

            // 🌟 WELCOME BOX STYLE
            if (update.action === "add" && config.WELCOME === "true") {
                const WelcomeText = 
`╔═══ ❖•🌹•❖ ═══╗
   🎉 *WELCOME* 🎉
╚═══ ❖•🌹•❖ ═══╝

👋 Hello @${userName}  
🏡 Welcome to *${metadata.subject}*  
🧑 You are member *#${groupMembersCount}*  
⏰ Joined: ${timestamp}  

💬 *Group Description:*  
${desc}

🚀 Powered by ${config.BOT_NAME}`;

                await conn.sendMessage(update.id, {
                    image: { url: ppUrl },
                    caption: WelcomeText,
                    mentions: [num]
                });
            } 

            // 💔 GOODBYE BOX STYLE
            else if (update.action === "remove" && config.GOODBYE === "true") {
                const GoodbyeText = 
`╭═══ 💔❖•✦•❖💔 ═══╮
   😔 *GOODBYE* 😔
╰═══ 💔❖•✦•❖💔 ═══╯

👋 Farewell @${userName}  
⏰ Left at: ${timestamp}  
👥 Members Left: ${groupMembersCount}  

🌹 We’ll truly miss you.  
✨ Shine bright wherever you go.  

🚀 Powered by ${config.BOT_NAME}`;

                await conn.sendMessage(update.id, {
                    image: { url: ppUrl },
                    caption: GoodbyeText,
                    mentions: [num]
                });
            } 

            // ⚠️ DEMOTE BOX STYLE
            else if (update.action === "demote" && config.ADMIN_ACTION === "true") {
                const demoter = update.author.split("@")[0];
                await conn.sendMessage(update.id, {
                    text: 
`◆━━━━━━━━━━━━━━━◆
   ⚠️ *ADMIN ALERT* ⚠️
◆━━━━━━━━━━━━━━━◆

🔻 @${demoter} demoted @${userName}  
⏰ Time: ${timestamp}  
👥 Group: ${metadata.subject}  

🚀 Powered by ${config.BOT_NAME}`,
                    mentions: [update.author, num]
                });
            } 

            // 🎉 PROMOTE BOX STYLE
            else if (update.action === "promote" && config.ADMIN_ACTION === "true") {
                const promoter = update.author.split("@")[0];
                await conn.sendMessage(update.id, {
                    text: 
`✦━━━━━ 🔥 ━━━━━✦
   🎉 *PROMOTION* 🎉
✦━━━━━ 🔥 ━━━━━✦

🔺 @${promoter} promoted @${userName}  
⏰ Time: ${timestamp}  
👥 Group: ${metadata.subject}  

🔥 Big respect to our new admin!  
🚀 Powered by ${config.BOT_NAME}`,
                    mentions: [update.author, num]
                });
            }
        }
    } catch (err) {
        console.error('Group event error:', err);
    }
};

module.exports = GroupEvents;