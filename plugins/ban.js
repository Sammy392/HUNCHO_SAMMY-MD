const fs = require('fs');
const path = require('path');
const { cmd } = require('../command');

const banFile = path.resolve('./lib/ban.json');

// Ensure ban.json exists
if (!fs.existsSync(banFile)) {
    fs.writeFileSync(banFile, JSON.stringify([], null, 2));
}

// Helper to read ban list
const readBanList = () => JSON.parse(fs.readFileSync(banFile, 'utf-8'));

// Helper to write ban list
const writeBanList = (list) => fs.writeFileSync(banFile, JSON.stringify([...new Set(list)], null, 2));

// Ban command
cmd({
    pattern: 'ban',
    alias: ['blockuser', 'addban'],
    react: '⛔',
    desc: 'ban a user from bot 🤖',
    category: 'owner',
    use: '.ban <number|tag|reply>',
    filename: __filename
}, async (cmd, mek, m, { from, args, isCreator, reply }) => {
    try {
        if (!isCreator) {
            return reply('❌ owner-only command 🚫');
        }

        await cmd.sendMessage(from, { react: { text: '⏳', key: m.key } });

        const target = m.mentionedJid?.[0] ||
                      m.quoted?.sender ||
                      (args[0]?.replace(/[^0-9]/g, '') + '@s.whatsapp.net');

        if (!target) {
            return reply('❌ please provide a number, tag, or reply to a user 😔');
        }

        const banned = readBanList();
        if (banned.includes(target)) {
            return reply('❌ user already banned ⛔');
        }

        banned.push(target);
        writeBanList(banned);

        const caption = `
╭───[ *ʙᴀɴ ᴜsᴇʀ* ]───
├ *ᴜsᴇʀ*: ${target.replace('@s.whatsapp.net', '')} ⛔
├ *sᴛᴀᴛᴜs*: banned successfully 🚫
╰───[ *ᴘᴏᴘᴋɪᴅ* ]───
> *ᴍᴀᴅᴇ ʙʏ huncho*`;

        await cmd.sendMessage(from, {
            image: { url: 'https://files.catbox.moe/tbdd5d.jpg' },
            caption,
            contextInfo: { mentionedJid: [m.sender, target] }
        }, { quoted: mek });

        await cmd.sendMessage(from, { react: { text: '✅', key: m.key } });

    } catch (err) {
        console.error('❌ ban error:', err);
        await reply(`❌ error banning user: ${err.message || 'unknown error'} 😞`);
        await cmd.sendMessage(from, { react: { text: '❌', key: m.key } });
    }
});

// Unban command
cmd({
    pattern: 'unban',
    alias: ['removeban'],
    react: '✅',
    desc: 'unban a user from bot 🤖',
    category: 'owner',
    use: '.unban <number|tag|reply>',
    filename: __filename
}, async (cmd, mek, m, { from, args, isCreator, reply }) => {
    try {
        if (!isCreator) {
            return reply('❌ owner-only command 🚫');
        }

        await cmd.sendMessage(from, { react: { text: '⏳', key: m.key } });

        const target = m.mentionedJid?.[0] ||
                      m.quoted?.sender ||
                      (args[0]?.replace(/[^0-9]/g, '') + '@s.whatsapp.net');

        if (!target) {
            return reply('❌ please provide a number, tag, or reply to a user 😔');
        }

        const banned = readBanList();
        if (!banned.includes(target)) {
            return reply('❌ user not banned 🤷');
        }

        const updated = banned.filter(u => u !== target);
        writeBanList(updated);

        const caption = `
╭───[ *ᴜɴʙᴀɴ ᴜsᴇʀ* ]───
│
├ *ᴜsᴇʀ*: ${target.replace('@s.whatsapp.net', '')} ✅
├ *sᴛᴀᴛᴜs*: unbanned successfully 🎉
│
╰───[ *huncho* ]───
> *ᴍᴀᴅᴇ ʙʏ huncho*`;

        await cmd.sendMessage(from, {
            image: { url: 'https://files.catbox.moe/tbdd5d.jpg' },
            caption,
            contextInfo: { mentionedJid: [m.sender, target] }
        }, { quoted: mek });

        await cmd.sendMessage(from, { react: { text: '✅', key: m.key } });

    } catch (err) {
        console.error('❌ unban error:', err);
        await reply(`❌ error unbanning user: ${err.message || 'unknown error'} 😞`);
        await cmd.sendMessage(from, { react: { text: '❌', key: m.key } });
    }
});

// Listban command
cmd({
    pattern: 'listban',
    alias: ['banlist', 'bannedusers'],
    react: '📋',
    desc: 'list all banned users 📜',
    category: 'owner',
    use: '.listban',
    filename: __filename
}, async (cmd, mek, m, { from, isCreator, reply }) => {
    try {
        if (!isCreator) {
            return reply('❌ owner-only command 🚫');
        }

        await cmd.sendMessage(from, { react: { text: '⏳', key: m.key } });

        const banned = readBanList();
        if (banned.length === 0) {
            return reply('✅ no banned users found 😊');
        }

        const banList = banned
            .map((id, i) => `├ *${i + 1}.* ${id.replace('@s.whatsapp.net', '')}`)
            .join('\n');

        const caption = `
╭───[ *ʙᴀɴ ʟɪsᴛ* ]───
├ *ᴛᴏᴛᴀʟ*: ${banned.length} users ⛔
${banList}
╰───[ *huncho* ]───
> *ᴍᴀᴅᴇ ʙʏ huncho*`;

        await cmd.sendMessage(from, {
            image: { url: 'https://i.ibb.co/rfvKLDfp/popkid.jpg' },
            caption,
            contextInfo: { mentionedJid: [m.sender] }
        }, { quoted: mek });

        await cmd.sendMessage(from, { react: { text: '✅', key: m.key } });

    } catch (err) {
        console.error('❌ listban error:', err);
        await reply(`❌ error listing bans: ${err.message || 'unknown error'} 😞`);
        await cmd.sendMessage(from, { react: { text: '❌', key: m.key } });
    }
});
