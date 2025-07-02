import axios from "axios";
import fs from "fs";
import path from "path";
import AdmZip from "adm-zip";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load config
const configPath = path.join(__dirname, '../config.cjs');
const config = await import(configPath).then(m => m.default || m).catch(() => ({}));

// Stylish update command
const update = async (m, sock) => {
    const prefix = config.PREFIX || '.';
    const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';

    if (cmd !== 'update') return;

    const botNumber = await sock.decodeJid(sock.user.id);
    if (m.sender !== botNumber) {
        return sock.sendMessage(m.from, {
            text: '🚫 *Only the bot can execute this command!*',
        }, { quoted: m });
    }

    await m.React('🛰️');
    const sent = await sock.sendMessage(m.from, {
        image: { url: 'https://files.catbox.moe/x0ohbm.jpg' }, // Thumbnail
        caption: `🔍 *Scanning for updates...*\nPlease wait...`,
        contextInfo: {
            forwardingScore: 5,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterName: "huncho xmd",
                newsletterJid: "120363420342566562@newsletter",
            },
        }
    }, { quoted: m });

    const editMessage = async (newCaption) => {
        try {
            await sock.sendMessage(m.from, {
                image: { url: 'https://files.catbox.moe/x0ohbm.jpg' },
                caption: newCaption,
                contextInfo: {
                    forwardingScore: 5,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterName: "huncho md",
                        newsletterJid: "120363420342566562@newsletter",
                    },
                }
            }, { quoted: m });
        } catch (e) {
            console.log("❌ Failed to edit message:", e.message);
        }
    };

    try {
        const { data: commitData } = await axios.get('https://api.github.com/repos/devpopkid/POPKID-GLE/commits/main');
        const latestCommitHash = commitData.sha;

        const packagePath = path.join(process.cwd(), 'package.json');
        const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
        const currentHash = packageJson.commitHash || 'unknown';

        if (latestCommitHash === currentHash) {
            await m.React('✅');
            return editMessage('✅ *Bot is already up to date!*');
        }

        await editMessage('📥 *New version found! Downloading update...*');

        const zipUrl = 'https://github.com/devpopkid/POPKID-GLE/archive/refs/heads/main.zip';
        const zipPath = path.join(process.cwd(), 'update.zip');
        const writer = fs.createWriteStream(zipPath);

        const response = await axios({ method: 'GET', url: zipUrl, responseType: 'stream' });

        if (response.status !== 200) {
            throw new Error(`Download failed with status code ${response.status}`);
        }

        response.data.pipe(writer);

        await new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });

        await editMessage('📦 *Extracting update files...*');

        const extractTo = path.join(process.cwd(), 'latest');
        const zip = new AdmZip(zipPath);
        zip.extractAllTo(extractTo, true);

        await editMessage('🔁 *Applying update...*');

        const sourceDir = path.join(extractTo, 'POPKID-GLE-main');
        await copyFolderSync(sourceDir, process.cwd(), ['package.json', 'config.cjs', '.env']);

        packageJson.commitHash = latestCommitHash;
        fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));

        fs.unlinkSync(zipPath);
        fs.rmSync(extractTo, { recursive: true, force: true });

        await editMessage('✅ *Update successful! Restarting bot...*');
        setTimeout(() => process.exit(0), 3000);

    } catch (err) {
        console.error("❌ Update Error:", err.message);
        await m.React("❌");
        await sock.sendMessage(m.from, {
            text: `🚨 *Update Failed!*\nReason: ${err.message}`,
        }, { quoted: m });
    }
};

// Utility to copy folders, skip specified files
async function copyFolderSync(src, dest, skip = []) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    for (const item of fs.readdirSync(src)) {
        const srcPath = path.join(src, item);
        const destPath = path.join(dest, item);
        if (skip.includes(item)) continue;
        const stat = fs.lstatSync(srcPath);
        if (stat.isDirectory()) {
            await copyFolderSync(srcPath, destPath, skip);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

export default update;
