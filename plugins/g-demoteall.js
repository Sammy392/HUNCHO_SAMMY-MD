const { cmd } = require('../command');
const config = require('../config');
const moment = require('moment-timezone');

cmd({
    pattern: 'bulkdemote',
    alias: ['massdemote'],
    desc: 'Demotes all admins to members (excluding bot & owners)',
    category: 'admin',
    react: '🔻',
    filename: __filename,
    usage: `${config.PREFIX}bulkdemote`
}, async (cmd, mek, m, { from, isGroup, isBotAdmins, sender, botNumber, reply, isOwner }) => {
    try {
        if (!isGroup) return reply("❌ ᴛʜɪs ᴄᴏᴍᴍᴀɴᴅ ɪs ᴏɴʟʏ ғᴏʀ ɢʀᴏᴜᴘs");

        // Fetch fresh group metadata
        const groupMetadata = await cmd.groupMetadata(from);
        const participants = groupMetadata.participants;
        const isSenderAdmin = participants.some(p => p.id === sender && p.admin);
        if (!isSenderAdmin && !isOwner) {
            return reply("❌ ᴏɴʟʏ ɢʀᴏᴜᴘ ᴀᴅᴍɪɴs ᴏʀ ᴛʜᴇ ʙᴏᴛ ᴏᴡɴᴇʀ ᴄᴀɴ ᴜsᴇ ᴛʜɪs ᴄᴏᴍᴍᴀɴᴅ");
        }
        if (!isBotAdmins) return reply("❌ ɪ ɴᴇᴇᴅ ᴛᴏ ʙᴇ ᴀɴ ᴀᴅᴍɪɴ ᴛᴏ ᴅᴇᴍᴏᴛᴇ ᴍᴇᴍʙᴇʀs");

        const ownerNumbers = config.OWNER_NUMBERS || ['254790375710', '267857', '254740007567'];
        const botJid = botNumber;

        // Filter admins to demote
        const targets = participants
            .filter(p => p.admin && !ownerNumbers.includes(p.id.split('@')[0]) && p.id !== botJid)
            .map(p => p.id);

        if (!targets.length) {
            return reply("❌ ɴᴏ ᴀᴅᴍɪɴs ᴛᴏ ᴅᴇᴍᴏᴛᴇ (ᴇxᴄʟᴜᴅɪɴɢ ᴏᴡɴᴇʀs ᴀɴᴅ ʙᴏᴛ)");
        }

        // Limit to 50 demotions to avoid rate limits
        if (targets.length > 50) {
            return reply("❌ ᴛᴏᴏ ᴍᴀɴʏ ᴀᴅᴍɪɴs ᴛᴏ ᴅᴇᴍᴏᴛᴇ (ᴍᴀx 50)");
        }

        await reply(`⏳ ᴅᴇᴍᴏᴛɪɴɢ ${targets.length} ᴀᴅᴍɪɴ(s)...`);

        let success = 0, failed = 0;
        const failedJids = [];
        for (const jid of targets) {
            try {
                await cmd.groupParticipantsUpdate(from, [jid], 'demote');
                success++;
            } catch (error) {
                console.error(`❌ Failed to demote ${jid}:`, error.message);
                failed++;
                failedJids.push(jid.split('@')[0]);
            }
        }

        // Send result with timestamp
        const timestamp = moment().tz(config.TIMEZONE || 'Africa/Harare').format('DD/MM/YYYY HH:mm:ss');
        const resultText = `
╭──〔*ᴅᴇᴍᴏᴛᴇ* 〕〕──
│ ✅ *sᴜᴄᴄᴇss*
│ ➸ 🟢 ᴅᴇᴍᴏᴛᴇᴅ: ${success}
│ ➸ 🔴 ғᴀɪʟᴇᴅ: ${failed}${failed ? `\n│ ➸ ᴇʀʀᴏʀs: @${failedJids.join(', @')}` : ''}
│ ⏰ *ᴛɪᴍᴇ*: ${timestamp}
╰──────────────⬣`;

        await cmd.sendMessage(from, {
            text: resultText,
            mentions: failedJids.map(jid => `${jid}@s.whatsapp.net`),
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: config.NEWSLETTER_JID || '120363420342566562@newsletter',
                    newsletterName: config.OWNER_NAME || 'popkid',
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

    } catch (error) {
        console.error('❌ Bulk demote error:', error.message);
        let errorMsg = '❌ ғᴀɪʟᴇᴅ ᴛᴏ ᴄᴏᴍᴘʟᴇᴛᴇ ʙᴜʟᴋ ᴅᴇᴍᴏᴛᴇ.';
        if (error.message.includes('not-authorized')) {
            errorMsg += ' ɪɴsᴜғғɪᴄɪᴇɴᴛ ᴘᴇʀᴍɪssɪᴏɴs.';
        } else {
            errorMsg += ' ᴘʟᴇᴀsᴇ ᴛʀʏ ᴀɢᴀɪɴ ʟᴀᴛᴇʀ.';
        }
        await reply(errorMsg);
    }
});
