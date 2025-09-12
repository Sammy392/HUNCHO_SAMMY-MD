const { cmd } = require('../command');
const config = require('../config');
const moment = require('moment-timezone');

cmd({
    pattern: 'poll',
    category: 'group',
    desc: 'Create a poll with a question and options in the group',
    react: '📊',
    filename: __filename,
    usage: `${config.PREFIX}poll question;option1,option2,option3... [|multiple]`
}, async (cmd, mek, m, { from, isGroup, sender, reply, isOwner }) => {
    try {
        if (!isGroup) return reply("❌ ᴛʜɪs ᴄᴏᴍᴍᴀɴᴅ ᴄᴀɴ ᴏɴʟʏ ʙᴇ ᴜsᴇᴅ ɪɴ ɢʀᴏᴜᴘs");

        // Fetch group metadata
        const groupMetadata = await cmd.groupMetadata(from);
        const participants = groupMetadata.participants;
        const isSenderAdmin = participants.some(p => p.id === sender && p.admin);
        const isBotAdmin = participants.some(p => p.id === cmd.user.id && p.admin);

        if (!isBotAdmin) return reply("❌ ɪ ɴᴇᴇᴅ ᴛᴏ ʙᴇ ᴀɴ ᴀᴅᴍɪɴ ᴛᴏ ᴄʀᴇᴀᴛᴇ ᴘᴏʟʟs");
        if (!isSenderAdmin && !isOwner) {
            return reply("❌ ᴏɴʟʏ ɢʀᴏᴜᴘ ᴀᴅᴍɪɴs ᴏʀ ᴛʜᴇ ʙᴏᴛ ᴏᴡɴᴇʀ ᴄᴀɴ ᴜsᴇ ᴛʜɪs ᴄᴏᴍᴍᴀɴᴅ");
        }

        // Parse input
        const [questionPart, ...rest] = m.body.split(';');
        const optionsString = rest.join(';').split('|')[0]; // Handle multiple semicolons
        const isMultiple = m.body.includes('|multiple');
        const question = questionPart.replace(new RegExp(`^${config.PREFIX}poll\\s+`), '').trim();

        if (!question || !optionsString) {
            return reply(
                `╭──〔 🤖 *ᴘᴏʟʟ* 〕──\n` +
                `│\n` +
                `│ 📜 *ᴜsᴀɢᴇ:*\n` +
                `│ ➸ ${config.PREFIX}poll question;option1,option2,option3... [|multiple]\n` +
                `│\n` +
                `│ 💡 *ᴇxᴀᴍᴘʟᴇ:*\n` +
                `│ ➸ ${config.PREFIX}poll Favorite color?;Red,Blue,Green\n` +
                `│ ➸ ${config.PREFIX}poll Best time?;Morning,Evening|multiple\n` +
                `╰──────────────`
            );
        }

        // Parse and validate options
        const options = optionsString.split(',').map(opt => opt.trim()).filter(opt => opt !== '');
        if (options.length < 2) return reply("❌ ᴘʟᴇᴀsᴇ ᴘʀᴏᴠɪᴅᴇ ᴀᴛ ʟᴇᴀsᴛ ᴛᴡᴏ ᴏᴘᴛɪᴏɴs");
        if (options.length > 12) return reply("❌ ᴛᴏᴏ ᴍᴀɴʏ ᴏᴘᴛɪᴏɴs (ᴍᴀx 12)");
        if (question.length > 300) return reply("❌ ᴏᴜᴇsᴛɪᴏɴ ᴛᴏᴏ ʟᴏɴɢ (ᴍᴀx 300 ᴄʜᴀʀᴀᴄᴛᴇʀs)");
        if (options.some(opt => opt.length > 100)) return reply("❌ ᴏɴᴇ ᴏʀ ᴍᴏʀᴇ ᴏᴘᴛɪᴏɴs ᴛᴏᴏ ʟᴏɴɢ (ᴍᴀx 100 ᴄʜᴀʀᴀᴄᴛᴇʀs ᴇᴀᴄʜ)");

        // Create poll
        await cmd.sendMessage(from, {
            poll: {
                name: question,
                values: options,
                selectableCount: isMultiple ? 0 : 1, // 0 allows multiple selections
                toAnnouncementGroup: config.POLL_TO_ANNOUNCEMENT || false
            },
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: config.NEWSLETTER_JID || '120363420342566562@newsletter',
                    newsletterName: config.OWNER_NAME || 'POPKID KE',
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

        // Send confirmation
        const timestamp = moment().tz(config.TIMEZONE || 'Africa/Harare').format('DD/MM/YYYY HH:mm:ss');
        await reply(
            `╭──〔〔 🤖 *ᴘᴏʟʟ* 〕──\n` +
            `│\n` +
            `│ ✅ *sᴜᴄᴄᴇss*\n` +
            `│ ➸ ᴘᴏʟʟ ᴄʀᴇᴀᴛᴇᴅ: "${question}"\n` +
            `│ ⏰ *ᴛɪᴍᴇ*: ${timestamp}\n` +
            `╰──────────────`
        );

    } catch (error) {
        console.error('❌ Poll command error:', error.message);
        let errorMsg = '❌ ғᴀɪʟᴇᴅ ᴛᴏ ᴄʀᴇᴀᴛᴇ ᴘᴏʟʟ.';
        if (error.message.includes('not-authorized')) {
            errorMsg += ' ɪɴsᴜғғɪᴄɪᴇɴᴛ ᴘᴇʀᴍɪssɪᴏɴs.';
        } else if (error.message.includes('invalid')) {
            errorMsg += ' ɪɴᴠᴀʟɪᴅ ᴘᴏʟʟ ᴅᴀᴛᴀ.';
        } else {
            errorMsg += ' ᴘʟᴇᴀsᴇ ᴛʀʏ ᴀɢᴀɪɴ ʟᴀᴛᴇʀ.';
        }
        await reply(errorMsg);
    }
});
