const { cmd } = require('../command');
const config = require('../config');

cmd({
    pattern: "getpp",
    alias: ["stealpp"],
    react: "🖼️",
    desc: "Fetches the profile picture of a user by phone number (owner only)",
    category: "owner",
    use: ".getpp <phone number>",
    filename: __filename
},
async (cmd, mek, m, { from, args, reply, isOwner, l }) => {
    try {
        // Owner-only restriction
        if (!isOwner) {
            return reply(`╔══✦══╗
🛑 *Access Denied!*  
Only the *Owner* can use this command.
╚══✦══╝`);
        }

        // Require phone number
        if (!args[0]) {
            return reply(`🔥 *Usage:*  
\`.getpp 1234567890\`  
_(Enter a valid phone number)_`);
        }

        // Format phone number to JID
        let targetJid = args[0].replace(/[^0-9]/g, "") + "@s.whatsapp.net";

        // Try fetching profile picture
        let ppUrl;
        try {
            ppUrl = await cmd.profilePictureUrl(targetJid, "image");
        } catch {
            return reply(`🖼️ This user has *no profile picture* or it cannot be accessed!`);
        }

        // Get username if possible
        let userName = targetJid.split("@")[0]; 
        try {
            const contact = await cmd.getContact(targetJid);
            userName = contact.notify || contact.vname || userName;
        } catch {
            // fallback to number if contact info unavailable
        }

        // Send result
        await cmd.sendMessage(from, { 
            image: { url: ppUrl }, 
            caption: `✨ *Profile Picture Found!*  
📌 *User:* ${userName}`
        }, { quoted: mek });

        // React success
        await cmd.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (e) {
        reply(`❌ *An error occurred while fetching profile picture!*  
Please try again later.`);
        l(e); // log error
    }
});
