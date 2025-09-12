const fs = require("fs");
const config = require("../config");
const { cmd, commands } = require("../command");
const path = require('path');

cmd({
    pattern: "privacy",
    alias: ["privacymenu"],
    desc: "Privacy settings menu",
    category: "privacy",
    react: "🔐",
    filename: __filename
}, 
async (cmd, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {

        let privacyMenu = `
╭━━〔 *ᴘʀɪᴠᴀᴄʏ sᴇᴛᴛɪɴɢs* 〕━━┈⊷
┇• ʙʟᴏᴄᴋʟɪsᴛ - ᴠɪᴇᴡ ʙʟᴏᴄᴋᴇᴅ ᴜsᴇʀs
┇• ɢᴇᴛʙɪᴏ - ɢᴇᴛ ᴜsᴇʀ's ʙɪᴏ
┇• sᴇᴛᴘᴘᴀʟʟ - sᴇᴛ ᴘʀᴏғɪʟᴇ ᴘɪᴄ ᴘʀɪᴠᴀᴄʏ
┇• sᴇᴛᴏɴʟɪɴᴇ - sᴇᴛ ᴏɴʟɪɴᴇ ᴘʀɪᴠᴀᴄʏ
┇• sᴇᴛᴘᴘ - ᴄʜᴀɴɢᴇ ʙᴏᴛ's ᴘʀᴏғɪʟᴇ ᴘɪᴄ
┇• sᴇᴛᴍʏɴᴀᴍᴇ - ᴄʜᴀɴɢᴇ ʙᴏᴛ's ɴᴀᴍᴇ
┇• ᴜᴘᴅᴀᴛᴇʙɪᴏ - ᴄʜᴀɴɢᴇ ʙᴏᴛ's ʙɪᴏ
┇• ɢʀᴏᴜᴘsᴘʀɪᴠᴀᴄʏ - sᴇᴛ ɢʀᴏᴜᴘ ᴀᴅᴅ ᴘʀɪᴠᴀᴄʏ
┇• ɢᴇᴛᴘʀɪᴠᴀᴄʏ - ᴠɪᴇᴡ ᴄᴜʀʀᴇɴᴛ ᴘʀɪᴠᴀᴄʏ sᴇᴛᴛɪɴɢs
┇• ɢᴇᴛᴘᴘ - ɢᴇᴛ ᴜsᴇʀ's ᴘʀᴏғɪʟᴇ ᴘɪᴄᴛᴜʀᴇ
┇
┇*ᴏᴘᴛɪᴏɴs ғᴏʀ ᴘʀɪᴠᴀᴄʏ ᴄᴏᴍᴍᴀɴᴅs:*
┇• ᴀʟʟ - ᴇᴠᴇʀʏᴏɴᴇ
┇• ᴄᴏɴᴛᴀᴄᴛs - ᴍʏ ᴄᴏɴᴛᴀᴄᴛs ᴏɴʟʏ
┇• ᴄᴏɴᴛᴀᴄᴛ_ʙʟᴀᴄᴋʟɪsᴛ - ᴄᴏɴᴛᴀᴄᴛs ᴇxᴄᴇᴘᴛ ʙʟᴏᴄᴋᴇᴅ
┇• ɴᴏɴᴇ - ɴᴏʙᴏᴅʏ
┇• ᴍᴀᴛᴄʜ_ʟᴀsᴛ_sᴇᴇɴ - ᴍᴀᴛᴄʜ ʟᴀsᴛ sᴇᴇɴ
╰──────────────┈⊷

📌 *Note*: Some commands are owner-only`;

        
        await cmd.sendMessage(
            from,
            {
                image: { url: `https://files.catbox.moe/tbdd5d.jpg` }, // Replace with privacy-themed image if available
                caption: privacyMenu,
                contextInfo: {
                    mentionedJid: [m.sender],
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363420342566562@newsletter',
                        newsletterName: "popkid",
                        serverMessageId: 143
                    }
                }
            },
            { quoted: mek }
        );

    } catch (e) {
        console.log(e);
        reply(`Error: ${e.message}`);
    }
});

cmd({
    pattern: "blocklist",
    alias: "blacklist",
    desc: "View the list of blocked users.",
    category: "privacy",
    react: "📋",
    filename: __filename
},
async (cmd, mek, m, { from, isOwner, reply }) => {
    if (!isOwner) return reply("*📛 You are not the owner!*");

    try {
        // Fetch the block list
        const blockedUsers = await cmd.fetchBlocklist();

        if (blockedUsers.length === 0) {
            return reply("📋 Your block list is empty.");
        }

        // Format the blocked users with 📌 and count the total
        const list = blockedUsers
            .map((user, i) => `🚫 ʙʟᴏᴄᴋᴇᴅ ${user.split('@')[0]}`) // Remove domain and add 📌
            .join('\n');

        const count = blockedUsers.length;
        reply(`📋 \`POPKID XTR BLOCKED USERS (${count})\`:\n\n${list}`);
    } catch (err) {
        console.error(err);
        reply(`❌ Failed to fetch block list: ${err.message}`);
    }
});

cmd({
    pattern: "getbio",
    desc: "Displays the user's bio.",
    category: "privacy",
    react: "📋",
    filename: __filename,
}, async (cmd, mek, m, { args, reply }) => {
    try {
        const jid = args[0] || mek.key.remoteJid;
        const about = await cmd.fetchStatus?.(jid);
        if (!about) return reply("No bio found.");
        return reply(`User Bio:\n\n${about.status}`);
    } catch (error) {
        console.error("Error in bio command:", error);
        reply("No bio found.");
    }
});
cmd({
    pattern: "setppall",
    desc: "Update Profile Picture Privacy",
    category: "privacy",
    react: "🔐",
    filename: __filename
}, 
async (cmd, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    if (!isOwner) return reply("❌ You are not the owner!");
    
    try {
        const value = args[0] || 'all'; 
        const validValues = ['all', 'contacts', 'contact_blacklist', 'none'];  
        
        if (!validValues.includes(value)) {
            return reply("❌ Invalid option. Valid options are: 'all', 'contacts', 'contact_blacklist', 'none'.");
        }
        
        await cmd.updateProfilePicturePrivacy(value);
        reply(`✅ Profile picture privacy updated to: ${value}`);
    } catch (e) {
        return reply(`*An error occurred while processing your request.*\n\n_Error:_ ${e.message}`);
    }
});
cmd({
    pattern: "setonline",
    desc: "Update Online Privacy",
    category: "privacy",
    react: "🔐",
    filename: __filename
}, 
async (cmd, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    if (!isOwner) return reply("❌ You are not the owner!");

    try {
        const value = args[0] || 'all'; 
        const validValues = ['all', 'match_last_seen'];
        
        if (!validValues.includes(value)) {
            return reply("❌ Invalid option. Valid options are: 'all', 'match_last_seen'.");
        }

        await cmd.updateOnlinePrivacy(value);
        reply(`✅ Online privacy updated to: ${value}`);
    } catch (e) {
        return reply(`*An error occurred while processing your request.*\n\n_Error:_ ${e.message}`);
    }
});
/*
cmd({
    pattern: "setpp",
    alias: "setdp",
    desc: "Set bot profile picture.",
    category: "privacy",
    react: "🖼️",
    filename: __filename
},
async (cmd, mek, m, { from, isOwner, quoted, reply }) => {
    if (!isOwner) return reply("❌ You are not the owner!");
    if (!quoted || !quoted.message.imageMessage) return reply("❌ Please reply to an image.");
    try {
        const stream = await downloadContentFromMessage(quoted.message.imageMessage, 'image');
        let buffer = Buffer.from([]);
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk]);
        }

        const mediaPath = path.join(__dirname, `${Date.now()}.jpg`);
        fs.writeFileSync(mediaPath, buffer);

        // Update profile picture with the saved file
        await cmd.updateProfilePicture(cmd.user.jid, { url: `file://${mediaPath}` });
        reply("🖼️ Profile picture updated successfully!");
    } catch (error) {
        console.error("Error updating profile picture:", error);
        reply(`❌ Error updating profile picture: ${error.message}`);
    }
});
*/
cmd({
    pattern: "setmyname",
    alias: "setname",
    desc: "Set your WhatsApp display name.",
    category: "privacy",
    react: "⚙️",
    filename: __filename
},
async (cmd, mek, m, { from, isOwner, reply, args }) => {
    if (!isOwner) return reply("❌ You are not the owner!");

    // Ensure you have the display name argument
    const displayName = args.join(" ");
    if (!displayName) return reply("❌ Please provide a display name.");

    try {
        // Ensure the session is loaded before trying to update
        const { state, saveCreds } = await useMultiFileAuthState('path/to/auth/folder');
        const cmd = makeWASocket({
            auth: state,
            printQRInTerminal: true,
        });

        cmd.ev.on('creds.update', saveCreds);

        // Update display name after connection
        await cmd.updateProfileName(displayName);
        reply(`✅ Your display name has been set to: ${displayName}`);
    } catch (err) {
        console.error(err);
        reply("❌ Failed to set your display name.");
    }
});

cmd({
    pattern: "updatebio",
    alias: "setbio",
    react: "🥏",
    desc: "Change the Bot number Bio.",
    category: "privacy",
    use: '.updatebio',
    filename: __filename
},
async (cmd, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!isOwner) return reply('🚫 *You must be an Owner to use this command*');
        if (!q) return reply('❓ *Enter the New Bio*');
        if (q.length > 139) return reply('❗ *Sorry! Character limit exceeded*');
        await cmd.updateProfileStatus(q);
        await cmd.sendMessage(from, { text: "✔️ *New Bio Added Successfully*" }, { quoted: mek });
    } catch (e) {
        reply('🚫 *An error occurred!*\n\n' + e);
        l(e);
    }
});
cmd({
    pattern: "groupsprivacy",
    desc: "Update Group Add Privacy",
    category: "privacy",
    react: "🔐",
    filename: __filename
}, 
async (cmd, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    if (!isOwner) return reply("❌ You are not the owner!");

    try {
        const value = args[0] || 'all'; 
        const validValues = ['all', 'contacts', 'contact_blacklist', 'none'];
        
        if (!validValues.includes(value)) {
            return reply("❌ Invalid option. Valid options are: 'all', 'contacts', 'contact_blacklist', 'none'.");
        }

        await cmd.updateGroupsAddPrivacy(value);
        reply(`✅ Group add privacy updated to: ${value}`);
    } catch (e) {
        return reply(`*An error occurred while processing your request.*\n\n_Error:_ ${e.message}`);
    }
});

cmd({
  pattern: "getprivacy",
  desc: "Get current privacy settings.",
  category: "owner",
  filename: __filename
}, async (cmd, mek, m, { isOwner, reply }) => {
  if (!isOwner) return reply("❌ Owner-only command!");
  try {
    const p = await cmd.fetchPrivacySettings?.(true);
    const msg = `🔐 *Privacy Settings:*

📶 Read Receipts: ${p.readreceipts}
🖼️ Profile Pic: ${p.profile}
📱 Status: ${p.status}
🌐 Online: ${p.online}
🕒 Last Seen: ${p.last}
👥 Group Add: ${p.groupadd}
📞 Call: ${p.calladd}`;
    reply(msg);
  } catch (e) {
    reply(`❌ Failed to get privacy settings: ${e.message}`);
  }
});

// 🖼️ Get Profile Picture

    
