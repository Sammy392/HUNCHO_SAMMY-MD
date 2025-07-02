import axios from 'axios';
import yts from 'yt-search';

const BASE_URL = 'https://noobs-api.top';
const FALLBACK_URL = 'https://jawad-tech.vercel.app/download/ytmp3';

const formatOptions = [
  { emoji: '1️⃣', name: '🎧 Audio (Voice)', format: 'mp3', type: 'audio', pushAs: 'voice' },
  { emoji: '2️⃣', name: '🎬 Video', format: 'mp4', type: 'video', pushAs: 'video' },
  { emoji: '3️⃣', name: '📄 Audio (Document)', format: 'mp3', type: 'audio', pushAs: 'doc' },
  { emoji: '4️⃣', name: '📁 Video (Document)', format: 'mp4', type: 'video', pushAs: 'doc' },
  { emoji: '5️⃣', name: '🎙️ Voice Note (PTT)', format: 'mp3', type: 'audio', pushAs: 'ptt' }
];

const cache = new Map();

const delayTyping = async (sock, jid, text = '🎵 𝙋𝙊𝙋𝙆𝙄𝘿 𝙂𝙇𝙀 𝙄𝙎 𝘿𝙀𝘾𝙊𝘿𝙄𝙉𝙂...') => {
  await sock.sendPresenceUpdate('composing', jid);
  await sock.sendMessage(jid, { text }, { ephemeralExpiration: 86400 });
};

const sendError = async (sock, jid, error, m) => {
  console.error(`[POP🔴ERROR]:`, error.message);
  return sock.sendMessage(jid, {
    text: `❌ *ERROR:* \`\`\`${error.message}\`\`\`\n_Kindly try again later._`
  }, { quoted: m });
};

const fetchDownloadLink = async (videoId, ytUrl, format) => {
  const main = `${BASE_URL}/dipto/ytDl3?link=${videoId}&format=${format}`;
  const backup = `${FALLBACK_URL}?url=${encodeURIComponent(ytUrl)}`;
  try {
    const { data } = await axios.get(main);
    return data.downloadLink ? data : await axios.get(backup).then(res => res.data);
  } catch {
    return await axios.get(backup).then(res => res.data);
  }
};

const handleSearchAndPrompt = async (m, sock, query) => {
  const from = m.from;
  await delayTyping(sock, from);

  const { videos } = await yts(query);
  const video = videos?.[0];
  if (!video) {
    return sock.sendMessage(from, {
      text: '😔 *No results found.* Try something else.'
    }, { quoted: m });
  }

  cache.set(m.key.id, { video });

  let formats = formatOptions
    .map(opt => `${opt.emoji} ${opt.name}`)
    .join('\n');

  const caption = `
╭━━🎶 HUNCHO MD - 𝙎𝙀𝘼𝙍𝘾𝙃 𝙍𝙀𝙎𝙐𝙇𝙏 ━━╮
┃ 🎵 *Title:* ${video.title}
┃ 👤 *Channel:* ${video.author.name}
┃ ⏱️ *Duration:* ${video.timestamp}
┃ 📅 *Uploaded:* ${video.ago}
┃ 👁️ *Views:* ${video.views.toLocaleString()}
┃ 👍 *Likes:* ${video.likes?.toLocaleString() || 'N/A'}
┃ 🔗 *Link:* https://youtu.be/${video.videoId}
┃━━━━━━━━━━━━━━━━━━━━━━
┃ 💽 *Choose a format below:*
┃
${formats}
╰━━━━━━━━━━━━━━━━━━━━━━╯

📩 _Reply with a number (1-5) to download._
⚡ Powered by *HUNCHO MD BOT*
`.trim();

  await sock.sendMessage(from, {
    image: { url: video.thumbnail },
    caption
  }, { quoted: m });
};

const handleUserReply = async (m, sock) => {
  const from = m.from;
  const choice = parseInt(m.body.trim());
  const repliedToID = m.message?.extendedTextMessage?.contextInfo?.stanzaId;
  const cached = cache.get(repliedToID);

  if (!cached || isNaN(choice) || choice < 1 || choice > formatOptions.length) return;

  const video = cached.video;
  const formatOpt = formatOptions[choice - 1];
  const ytUrl = `https://www.youtube.com/watch?v=${video.videoId}`;

  try {
    await delayTyping(sock, from);
    const data = await fetchDownloadLink(video.videoId, ytUrl, formatOpt.format);

    if (!data.downloadLink) {
      return sock.sendMessage(from, {
        text: '❌ *Download link failed.* Try again.'
      }, { quoted: m });
    }

    const fileName = `${video.title.replace(/[\\/:*?"<>|]/g, '')}.${formatOpt.format}`;

    const confirmationCaption = `
📥 *${formatOpt.name} is ready for download!*

🎼 *${video.title}*  
🔗 https://youtu.be/${video.videoId}  
📁 *Format:* ${formatOpt.name}  
⏱️ *Duration:* ${video.timestamp}

🔥 Delivered by *huncho GLE*
`.trim();

    await sock.sendMessage(from, {
      image: { url: video.thumbnail },
      caption: confirmationCaption
    }, { quoted: m });

    const sendOptions = {
      mimetype: formatOpt.type === 'audio' ? 'audio/mpeg' : 'video/mp4',
      fileName
    };

    if (formatOpt.pushAs === 'doc') {
      sendOptions.document = { url: data.downloadLink };
    } else if (formatOpt.pushAs === 'ptt') {
      sendOptions.audio = { url: data.downloadLink };
      sendOptions.ptt = true;
    } else {
      sendOptions[formatOpt.type] = { url: data.downloadLink };
    }

    await sock.sendMessage(from, sendOptions, { quoted: m });
    cache.delete(repliedToID);

  } catch (err) {
    return sendError(sock, from, err, m);
  }
};

const mediaHandler = async (m, sock) => {
  const prefix = '.';
  const cmd = m.body.startsWith(prefix)
    ? m.body.slice(prefix.length).split(' ')[0].toLowerCase()
    : '';
  const text = m.body.slice(prefix.length + cmd.length).trim();

  if (cmd === 'play2') {
    if (!text) {
      return sock.sendMessage(m.from, {
        text: `❗ *Usage:* \`.play2 <song/video>\`\n💡 *Example:* \`.play2 calm down remix\``
      }, { quoted: m });
    }
    return handleSearchAndPrompt(m, sock, text);
  }

  if (m.message?.extendedTextMessage?.contextInfo?.stanzaId) {
    return handleUserReply(m, sock);
  }
};

export const aliases = ['play2'];
export default mediaHandler;
