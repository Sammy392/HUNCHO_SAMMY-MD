import { serialize, decodeJid } from '../../lib/Serializer.js';
import path from 'path';
import fs from 'fs/promises';
import config from '../../config.cjs';
import { smsg } from '../../lib/myfunc.cjs';
import { handleAntilink } from './antilink.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to get group admins
export const getGroupAdmins = (participants) => {
    let admins = [];
    for (let i of participants) {
        if (i.admin === "superadmin" || i.admin === "admin") {
            admins.push(i.id);
        }
    }
    return admins;
};

const Handler = async (chatUpdate, sock, logger) => {
    try {
        if (!chatUpdate || chatUpdate.type !== 'notify') return;

        const rawMessage = chatUpdate.messages?.[0];
        if (!rawMessage?.message) return;

        const m = serialize(JSON.parse(JSON.stringify(rawMessage)), sock, logger);
        if (!m?.body) return;

        const botNumber = sock.user.id.split(':')[0] + '@s.whatsapp.net';
        const ownerNumber = config.OWNER_NUMBER + '@s.whatsapp.net';

        const participants = m.isGroup
            ? await sock.groupMetadata(m.from).then(md => md.participants)
            : [];

        const groupAdmins = m.isGroup ? getGroupAdmins(participants) : [];
        const isBotAdmins = m.isGroup ? groupAdmins.includes(botNumber) : false;
        const isAdmins = m.isGroup ? groupAdmins.includes(m.sender) : false;

        const isCreator = [ownerNumber, botNumber].includes(m.sender);
        const isPublic = sock.public ?? (config.MODE === 'public');

        // Ignore if not public and not creator
        if (!isPublic && !isCreator) return;

        // Auto status seen
        if (m.key?.remoteJid === 'status@broadcast' && config.AUTO_STATUS_SEEN) {
            await sock.readMessages([m.key]);
        }

        // Prefix and command parsing
        const PREFIX = /^[\\/!#.]/;
        const isCmd = PREFIX.test(m.body);
        const prefix = isCmd ? m.body[0] : '';
        const cmd = isCmd ? m.body.slice(1).split(' ')[0].toLowerCase() : '';
        const text = isCmd ? m.body.slice(1 + cmd.length).trim() : '';

        // Handle Antilink
        await handleAntilink(m, sock, logger, isBotAdmins, isAdmins, isCreator);

        // Load plugins dynamically from "nitro" folder
        const pluginDir = path.join(__dirname, '..', 'nitro');
        const pluginFiles = await fs.readdir(pluginDir);

        for (const file of pluginFiles) {
            if (!file.endsWith('.js')) continue;

            const pluginPath = path.join(pluginDir, file);
            try {
                const pluginModule = await import(`file://${pluginPath}`);
                const execute = pluginModule.default;

                if (typeof execute === 'function') {
                    await execute(m, sock, { cmd, text, prefix, isCmd, isCreator, isAdmins, isBotAdmins });
                }
            } catch (err) {
                console.error(`❌ Failed to load plugin: ${file}`, err);
            }
        }

    } catch (e) {
        console.error('❌ Handler Error:', e);
    }
};

export default Handler;
