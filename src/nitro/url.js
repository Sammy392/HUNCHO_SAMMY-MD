import fetch from 'node-fetch';
import FormData from 'form-data';
import { fileTypeFromBuffer } from 'file-type';

const MAX_FILE_SIZE_MB = 200;

async function uploadMedia(buffer) {
  try {
    const { ext } = await fileTypeFromBuffer(buffer);
    const form = new FormData();
    form.append('fileToUpload', buffer, `file.${ext}`);
    form.append('reqtype', 'fileupload');

    const response = await fetch('https://catbox.moe/user/api.php', {
      method: 'POST',
      body: form,
    });

    if (!response.ok) throw new Error(`Upload failed: ${response.statusText}`);
    return await response.text();
  } catch (error) {
    console.error('Upload error:', error);
    throw new Error('❌ Upload failed. Try again later.');
  }
}

function getMediaType(mtype) {
  switch (mtype) {
    case 'imageMessage': return 'image';
    case 'videoMessage': return 'video';
    case 'audioMessage': return 'audio';
    default: return null;
  }
}

const tourl = async (m, bot) => {
  const validCommands = ['url', 'geturl', 'upload', 'u'];
  const prefixMatch = m.body?.trim().match(/^([\\/!#.\-])(\w+)/);
  if (!prefixMatch) return;

  const cmd = prefixMatch[2].toLowerCase();
  if (!validCommands.includes(cmd)) return;

  if (
    !m.quoted ||
    !['imageMessage', 'videoMessage', 'audioMessage'].includes(m.quoted.mtype)
  ) {
    return m.reply(
      `💀 *Invalid Input!*\nReply to an image, video, or audio.\n\n📥 Usage:\n\`${prefixMatch[1]}${cmd}\``
    );
  }

  try {
    const media = await m.quoted.download();
    if (!media) throw new Error('Media download failed.');

    const fileSizeMB = media.length / (1024 * 1024);
    if (fileSizeMB > MAX_FILE_SIZE_MB) {
      return m.reply(
        `⛔ *Upload Blocked!*\nFile size > ${MAX_FILE_SIZE_MB}MB`
      );
    }

    const mediaUrl = await uploadMedia(media);
    const mediaType = getMediaType(m.quoted.mtype);
    const mediaTypeName =
      mediaType.charAt(0).toUpperCase() + mediaType.slice(1);

    const contextInfo = {
      forwardingScore: 100,
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterName: "HunchoMd-HAX",
        newsletterJid: "1203634202566562@newsletter",
      },
    };

    const caption = `
🟩──[ 💀 HUNCHO4PERPEH HACKTOOL ]──🟩
📁 TYPE   : ${mediaTypeName}
🌍 LINK   : ${mediaUrl}
👤 USER   : ${m.pushName || "Anonymous"}
⏱️ TIME   : ${new Date().toLocaleString('en-GB')}
✅ STATUS : SUCCESS
🟩──────────────🟩
🔗 Huncho XMD Hacker Network
`.trim();

    if (mediaType === 'audio') {
      await bot.sendMessage(
        m.from,
        { text: caption, contextInfo },
        { quoted: m }
      );
    } else {
      await bot.sendMessage(
        m.from,
        {
          [mediaType]: { url: mediaUrl },
          caption,
          contextInfo,
        },
        { quoted: m }
      );
    }
  } catch (err) {
    console.error('Upload error:', err);
    return m.reply(`🚨 *SYSTEM ERROR:*\nTry again later.`);
  }
};

export default tourl;
