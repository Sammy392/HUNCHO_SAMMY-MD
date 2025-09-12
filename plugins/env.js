const fs = require('fs');
const path = require('path');
const config = require('../config');
const { cmd } = require('../command');

function updateEnvVariable(key, value) {
    const envPath = path.join(__dirname, "../.env");
    let env = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';
    const regex = new RegExp(`^${key}=.*`, "m");

    if (regex.test(env)) {
        env = env.replace(regex, `${key}=${value}`);
    } else {
        env += `\n${key}=${value}`;
    }

    fs.writeFileSync(envPath, env);

    // Reload dotenv and config
    require('dotenv').config({ path: envPath });

    // Clear config cache
    delete require.cache[require.resolve('../config')];
    Object.assign(config, require('../config'));  // Reload
}

function isEnabled(value) {
    return value && value.toString().toLowerCase() === "true";
}

cmd({
    pattern: "env",
    alias: ["config", "settings"],
    desc: "Bot config control panel via reply menu (ENV based)",
    category: "owner",
    react: "⚙️",
    filename: __filename
}, 
async (cmd, mek, m, { from, reply, isOwner }) => {
    if (!isOwner) return reply("ᴄᴏᴍᴍᴀɴᴅ ʀᴇsᴇʀᴠᴇᴅ ғᴏʀ ᴏᴡɴᴇʀ ᴀɴᴅ ᴍʏ ᴄʀᴇᴀᴛᴏʀ ᴀʟᴏɴᴇ");

    const menu = `┏─〔 *huncho xmd* 〕──⊷
┇๏ *1. ᴀᴜᴛᴏ ғᴇᴀᴛᴜʀᴇs*
┇๏ 1.2 - ᴀᴜᴛᴏ_ʀᴇᴀᴄᴛ (${isEnabled(config.AUTO_REACT) ? "✅" : "❌"})
┗──────────────⊷
┏──────────────⊷
┇๏ *2. sᴇᴄᴜʀɪᴛʏ*
┇๏ 2.1 - ᴀɴᴛɪ_ʟɪɴᴋ (${isEnabled(config.ANTI_LINK) ? "✅" : "❌"})
┇๏ 2.2 - ᴀɴᴛɪ_ʙᴀᴅ (${isEnabled(config.ANTI_BAD) ? "✅" : "❌"})
┇๏ 2.3 - �ᴇʟᴇᴛᴇ_ʟɪɴᴋs (${isEnabled(config.DELETE_LINKS) ? "✅" : "❌"})
┗──────────────⊷
┏──────────────⊷
┇๏ *3. sᴛᴀᴛᴜs sʏsᴛᴇᴍ*
┇๏ 3.1 - ᴀᴜᴛᴏ_sᴛᴀᴛᴜs_sᴇᴇɴ (${isEnabled(config.AUTO_STATUS_SEEN) ? "✅" : "❌"})
┇๏ 3.2 - ᴀᴜᴛᴏ_sᴛᴀᴛᴜs_ʀᴇᴘʟʏ (${isEnabled(config.AUTO_STATUS_REPLY) ? "✅" : "❌"})
┇๏ 3.3 - ᴀᴜᴛᴏ_sᴛᴀᴛᴜs_ʀᴇᴀᴄᴛ (${isEnabled(config.AUTO_STATUS_REACT) ? "✅" : "❌"})
┗──────────────⊷
┏──────────────⊷
┇๏ *4. ᴄᴏʀᴇ*
┇๏ 4.1 - ᴀʟᴡᴀʏs_ᴏɴʟɪɴᴇ (${isEnabled(config.ALWAYS_ONLINE) ? "✅" : "❌"})
┇๏ 4.2 - ʀᴇᴀᴅ_ᴍᴇssᴀɢᴇ (${isEnabled(config.READ_MESSAGE) ? "✅" : "❌"})
┇๏ 4.3 - ʀᴇᴀᴅ_ᴄᴍᴅ (${isEnabled(config.READ_CMD) ? "✅" : "❌"})
┇๏ 4.4 - �ᴜʙʟɪᴄ_ᴍᴏᴅᴇ (${isEnabled(config.PUBLIC_MODE) ? "✅" : "❌"})
┗──────────────⊷
┏──────────────⊷
┇๏ *5. ᴛʏᴘɪɴɢ/ʀᴇᴄᴏʀᴅɪɴɢ*
┇๏ 5.1 - ᴀᴜᴛᴏ_ᴛʏᴘɪɴɢ (${isEnabled(config.AUTO_TYPING) ? "✅" : "❌"})
┇๏ 5.2 - ᴀᴜᴛᴏ_ʀᴇᴄᴏʀᴅɪɴɢ (${isEnabled(config.AUTO_RECORDING) ? "✅" : "❌"})
┗──────────────⊷
_ʀᴇᴘʟʏ ᴡɪᴛʜ: 1.1, 2.2, ᴇᴛᴄ ᴛᴏ ᴛᴏɢɢʟᴇ ᴏɴ/ᴏғғ_
`;

    const sent = await cmd.sendMessage(from, {
        caption: menu,
        image: { url: "https://files.catbox.moe/tbdd5d.jpg" }
    }, { quoted: mek });

    const messageID = sent.key.id;

    const toggleSetting = (key) => {
        const current = isEnabled(config[key]);
        updateEnvVariable(key, current ? "false" : "true");
        return `✅ *${key}* ɪs ɴᴏᴡ sᴇᴛ ᴛᴏ: *${!current ? "ON" : "OFF"}*`;
    };

    const handler = async (msgData) => {
        const msg = msgData.messages[0];
        const quotedId = msg?.message?.extendedTextMessage?.contextInfo?.stanzaId;

        if (quotedId !== messageID) return;

        const text = msg.message?.conversation || msg.message?.extendedTextMessage?.text || "";

        const map = {
            "1.2": "AUTO_REACT",
            "2.1": "ANTI_LINK", "2.2": "ANTI_BAD", "2.3": "DELETE_LINKS",
            "3.1": "AUTO_STATUS_SEEN", "3.2": "AUTO_STATUS_REPLY", "3.3": "AUTO_STATUS_REACT",
            "4.1": "ALWAYS_ONLINE", "4.2": "READ_MESSAGE", "4.3": "READ_CMD", "4.4": "PUBLIC_MODE",
            "5.1": "AUTO_TYPING", "5.2": "AUTO_RECORDING"
        };

        const key = map[text];

        if (!key) return cmd.sendMessage(from, { text: "ʀᴇᴘʟʏ ᴡɪᴛʜ ᴀɴ ᴀᴠᴀɪʟᴀʙʟᴇ ɴᴜᴍʙᴇʀ." }, { quoted: msg });

        const res = toggleSetting(key);
        await cmd.sendMessage(from, { text: res }, { quoted: msg });
        cmd.ev.off("messages.upsert", handler);
    };

    cmd.ev.on("messages.upsert", handler);
    setTimeout(() => cmd.ev.off("messages.upsert", handler), 60_000);
});
