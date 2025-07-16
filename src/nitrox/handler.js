import { serialize, decodeJid } from '../../lib/Serializer.js';
import path from 'path';
import fs from 'fs/promises';
import config from '../../config.cjs';
import { smsg } from '../../lib/myfunc.cjs';
import { handleAntilink } from './antilink.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getGroupAdmins = (participants) => {
    let admins = [];
    for (let i of participants) {
        if (i.admin === "superadmin" || i.admin === "admin") {
            admins.push(i.id);
        }
    }
    return admins || [];
};

const Handler = async (chatUpdate, sock, logger) => {
    try {
        if (chatUpdate.type !== 'notify') return;
        const m = serialize(JSON.parse(JSON.stringify(chatUpdate.messages[0])), sock, logger);
        if (!m.message) return;

        const participants = m.isGroup ? await sock.groupMetadata(m.from).then(meta => meta.participants) : [];
        const groupAdmins = m.isGroup ? getGroupAdmins(participants) : [];
        const botId = sock.user.id.split(':')[0] + '@s.whatsapp.net';
        const isBotAdmins = m.isGroup ? groupAdmins.includes(botId) : false;
        const isAdmins = m.isGroup ? groupAdmins.includes(m.sender) : false;

        const PREFIX = /^[\\/!#.]/;
        const isCOMMAND = (body) => PREFIX.test(body);
        const prefixMatch = isCOMMAND(m.body) ? m.body.match(PREFIX) : null;
        const prefix = prefixMatch ? prefixMatch[0] : '/';
        const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
        const text = m.body.slice(prefix.length + cmd.length).trim();

        if (m.key && m.key.remoteJid === 'status@broadcast' && config.AUTO_STATUS_SEEN) {
            await sock.readMessages([m.key]);
        }

        const botNumber = await sock.decodeJid(sock.user.id);
        const ownerNumber = config.OWNER_NUMBER + '@s.whatsapp.net';
        const isCreator = m.sender === ownerNumber || m.sender === botNumber;

        // Only creator allowed if bot is not public
        if (!sock.public && !isCreator) return;

        // 🔒 Handle Antilink Logic
        await handleAntilink(m, sock, logger, isBotAdmins, isAdmins, isCreator);

        const { from } = m;

        // ✅ Built-in test command (Always works)
        if (cmd === 'ping') {
            await sock.sendMessage(from, { text: '✅ Bot is alive!' }, { quoted: m });
            return;
        }

        // 🧠 Plugin loading from /nitro folder
        const pluginDir = path.join(__dirname, '..', 'nitro');
        const pluginFiles = await fs.readdir(pluginDir);

        for (const file of pluginFiles) {
            if (file.endsWith('.js')) {
                const pluginPath = path.join(pluginDir, file);

                try {
                    const pluginModule = await import(`file://${pluginPath}`);
                    const loadPlugins = pluginModule.default;

                    if (typeof loadPlugins === 'function') {
                        await loadPlugins(m, sock);
                    } else {
                        console.warn(`Plugin ${file} does not export a default function`);
                    }
                } catch (err) {
                    console.error(`❌ Error in plugin ${file}:`, err);
                }
            }
        }
    } catch (e) {
        console.error('❌ Handler error:', e);
    }
};

export default Handler;
