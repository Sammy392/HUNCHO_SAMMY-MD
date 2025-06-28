import { serialize } from '../../lib/Serializer.js';

const antilinkSettings = {}; // { groupId: { enabled: boolean, action: 'delete' | 'warn' | 'kick', warningLimit: number, warnedUsers: { userId: warningCount } } }
const antilinkMenu = `
🛡️ Antilink Settings 🛡️

Choose an option by typing the corresponding number:
1. 🗑️ Delete Links
2. ⚠️ Warn Link Senders (with a limit)
3. 🚪 Kick Link Senders
`;

export const handleAntilink = async (m, sock, logger, isBotAdmins, isAdmins, isCreator) => {
    const PREFIX = /^[\\/!#.]/;
    const isCOMMAND = (body) => PREFIX.test(body);
    const prefixMatch = isCOMMAND(m.body) ? m.body.match(PREFIX) : null;
    const prefix = prefixMatch ? prefixMatch[0] : '/';
    const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';

    if (cmd === 'antilink') {
        if (!m.isGroup) {
            await sock.sendMessage(m.from, { text: '🚫 This command is exclusively for group chats! 🚫' }, { quoted: m });
            return;
        }

        if (!isBotAdmins) {
            await sock.sendMessage(m.from, { text: '👮‍♀️ For me to manage the antilink feature effectively, I need to be an admin in this group. Please grant me the necessary permissions! 🙏' }, { quoted: m });
            return;
        }

        if (!isAdmins) {
            await sock.sendMessage(m.from, { text: '🔒 Sorry, only the group admins have the privilege to configure the antilink feature. 🛡️' }, { quoted: m });
            return;
        }

        // If no further arguments, show the menu
        const args = m.body.slice(prefix.length + cmd.length).trim().split(/\s+/);
        if (args.length === 0 || args[0] === '') {
            await sock.sendMessage(m.from, { text: antilinkMenu }, { quoted: m });
            return;
        }

        const choice = args[0];

        if (choice === '1') {
            antilinkSettings[m.from] = { enabled: true, action: 'delete', warnedUsers: {} };
            await sock.sendMessage(m.from, { text: `🗑️ Antilink is now ON! Any group links shared by non-admins/creators will be immediately deleted.` }, { quoted: m });
            return;
        }

        if (choice === '2') {
            antilinkSettings[m.from] = { enabled: true, action: 'warn', warningLimit: 3, warnedUsers: {} };
            await sock.sendMessage(m.from, { text: `⚠️ Antilink with warnings is now ON! Non-admins/creators will be warned up to 3 times before being kicked.` }, { quoted: m });
            return;
        }

        if (choice === '3') {
            antilinkSettings[m.from] = { enabled: true, action: 'kick', warnedUsers: {} };
            await sock.sendMessage(m.from, { text: `🚪 Antilink with immediate kick is now ON! Non-admins/creators sharing group links will be kicked immediately.` }, { quoted: m });
            return;
        }

        if (args[0] === 'off') {
            delete antilinkSettings[m.from];
            await sock.sendMessage(m.from, { text: '🔓 Antilink feature has been turned OFF for this group. 🕊️' }, { quoted: m });
            return;
        }

        await sock.sendMessage(m.from, { text: `⚙️ Usage: ${prefix + cmd} (to see options) or ${prefix + cmd} off to disable.` }, { quoted: m });
        return;
    }

    if (antilinkSettings[m.from] && antilinkSettings[m.from].enabled) {
        const groupLinkRegex = /(?:https?:\/\/)?chat\.whatsapp\.com\/([a-zA-Z0-9_-]+)/gi;
        const matchedLinks = m.body.match(groupLinkRegex);
        const currentAction = antilinkSettings[m.from].action || 'warn';
        const warningLimit = antilinkSettings[m.from].warningLimit || 3;

        if (matchedLinks) {
            if (!isBotAdmins) {
                await sock.sendMessage(m.from, { text: `👮‍♀️ I need to be an admin to manage links effectively! 🙏` });
                return;
            }

            const currentGroupInvite = await sock.groupInviteCode(m.from);
            const currentGroupLinkRegex = new RegExp(`(?:https?:\/\/)?chat\\.whatsapp\\.com\\/${currentGroupInvite}`, 'i');

            for (const link of matchedLinks) {
                if (currentGroupLinkRegex.test(link)) {
                    await sock.sendMessage(m.from, { text: `🔗 That's a link to this group! No action taken.` });
                    continue;
                }

                if (isAdmins || isCreator) {
                    continue; // Admins and creator are exempt
                }

                const sender = m.sender;

                if (currentAction === 'delete') {
                    try {
                        await sock.sendMessage(m.from, {
                            delete: {
                                remoteJid: m.from,
                                fromMe: false,
                                id: m.key.id,
                                participant: m.key.participant
                            }
                        });
                        await sock.sendMessage(m.from, { text: `🗑️ Link shared by @${sender.split("@")[0]} has been deleted.`, contextInfo: { mentionedJid: [sender] } });
                    } catch (error) {
                        logger.error(`⚠️ Error deleting message from ${sender} in ${m.from}: ${error}`);
                        await sock.sendMessage(m.from, { text: `😬 Couldn't delete the link message.` });
                    }
                } else if (currentAction === 'warn') {
                    if (!antilinkSettings[m.from].warnedUsers[sender]) {
                        antilinkSettings[m.from].warnedUsers[sender] = 0;
                    }
                    antilinkSettings[m.from].warnedUsers[sender]++;

                    try {
                        await sock.sendMessage(m.from, {
                            delete: {
                                remoteJid: m.from,
                                fromMe: false,
                                id: m.key.id,
                                participant: m.key.participant
                            }
                        });
                    } catch (error) {
                        logger.error(`⚠️ Error deleting message from ${sender} in ${m.from}: ${error}`);
                        await sock.sendMessage(m.from, { text: `😬 Couldn't delete the link message.` });
                    }

                    if (antilinkSettings[m.from].warnedUsers[sender] >= warningLimit) {
                        try {
                            await sock.groupParticipantsUpdate(m.from, [sender], 'remove');
                            await sock.sendMessage(m.from, {
                                text: `@${sender.split("@")[0]} has been removed 🚪 for exceeding the link sharing limit (${warningLimit} warnings).`,
                                contextInfo: { mentionedJid: [sender] }
                            });
                            delete antilinkSettings[m.from].warnedUsers[sender];
                        } catch (error) {
                            logger.error(`🚨 Error kicking ${sender} from ${m.from}: ${error}`);
                            await sock.sendMessage(m.from, { text: `😓 Couldn't remove @${sender.split("@")[0]} due to an error.`, contextInfo: { mentionedJid: [sender] } });
                        }
                    } else {
                        await sock.sendMessage(m.from, {
                            text: `\`\`\`「 ⚠️ Group Link Detected! ⚠️ 」\`\`\`\n\n@${sender.split("@")[0]}, please don't share group links here. You have ${antilinkSettings[m.from].warnedUsers[sender]}/${warningLimit} warnings. Further violations will result in removal. 🚫`,
                            contextInfo: { mentionedJid: [sender] }
                        }, { quoted: m });
                    }
                } else if (currentAction === 'kick') {
                    try {
                        await sock.sendMessage(m.from, {
                            delete: {
                                remoteJid: m.from,
                                fromMe: false,
                                id: m.key.id,
                                participant: m.key.participant
                            }
                        });
                    } catch (error) {
                        logger.error(`⚠️ Error deleting message from ${sender} in ${m.from}: ${error}`);
                        await sock.sendMessage(m.from, { text: `😬 Couldn't delete the link message.` });
                    }
                    try {
                        await sock.groupParticipantsUpdate(m.from, [sender], 'remove');
                        await sock.sendMessage(m.from, {
                            text: `@${sender.split("@")[0]} has been removed 🚪 for sharing a group link. 🚫`,
                            contextInfo: { mentionedJid: [sender] }
                        });
                    } catch (error) {
                        logger.error(`🚨 Error kicking ${sender} from ${m.from}: ${error}`);
                        await sock.sendMessage(m.from, { text: `😓 Couldn't remove @${sender.split("@")[0]} due to an error.`, contextInfo: { mentionedJid: [sender] } });
                    }
                }
            }
        }
    }
};
