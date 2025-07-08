const { getSettings, getGroupSetting, updateGroupSetting } = require('../../Database/adapter');
const ownerMiddleware = require('../../utility/botUtil/Ownermiddleware');

module.exports = async (context) => {
    await ownerMiddleware(context, async () => {
        const { client, m, args } = context;
        const value = args[0]?.toLowerCase();
        const jid = m.chat;

        if (!jid.endsWith('@g.us')) {
            return await m.reply('❌ This command can only be used in groups.');
        }

        const settings = await getSettings();
        const prefix = settings.prefix;

        let groupSettings = await getGroupSetting(jid);
        let isEnabled = groupSettings?.antilink === true;

        const Myself = await client.decodeJid(client.user.id);
        const groupMetadata = await client.groupMetadata(m.chat);
        const userAdmins = groupMetadata.participants.filter(p => p.admin !== null).map(p => p.id);
        const isBotAdmin = userAdmins.includes(Myself);

        if (value === 'on' && !isBotAdmin) {
            return await m.reply('❌ Mbwa wewe, I need admin privileges to enable Antilink.');
        }

        if (value === 'on' || value === 'off') {
            const action = value === 'on';

            if (isEnabled === action) {
                return await m.reply(`✅ Antilink is already ${value.toUpperCase()}.`);
            }

            await updateGroupSetting(jid, 'antilink', action ? 'true' : 'false');
            await m.reply(`✅ Antilink has been turned ${value.toUpperCase()} for this group.`);
        } else {
            await m.reply(`📄 Current Antilink setting for this group: ${isEnabled ? 'ON' : 'OFF'}\n\n _Use ${prefix}antilink on or ${prefix}antilink off to change it._`);
        }
    });
};
