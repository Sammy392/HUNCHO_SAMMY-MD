import config from Po/config.cjs';
import fetch from 'node-fetch';

const popkidplay = async (m, sock) => {
  const prefix = config.PREFIX || '.';
  const body = m.body || '';
  const command = body.startsWith(prefix)
    ? body.slice(prefix.length).split(' ')[0].toLowerCase()
    : '';
  const q = body.slice(prefix.length + command.length).trim();

  // Only respond if command is popkidplay
  if (command !== 'hunchoplay') return;

  if (!q || (!q.includes('youtube.com') && !q.includes('youtu.be'))) {
    return sock.sendMessage(m.chat, {
      text: `❌ *Correct Usage:*\n${prefix}hunchoplay <YouTube URL>\n\n✅ Example:\n${prefix}hunchoplay https://youtu.be/60ItHLz5WEA`
    }, { quoted: m });
  }

  try {
    const apiUrl = `https://api.princetechn.com/api/download/mp3?apikey=prince_api_tjhv&url=${encodeURIComponent(q)}`;
    const res = await fetch(apiUrl);
    const json = await res.json();

    if (!json.status || !json.url) {
      return sock.sendMessage(m.chat, {
        text: `❌ Song not found or download failed. Try another link.`
      }, { quoted: m });
    }

    const { title, thumbnail, duration, url: audioUrl } = json;

    const thumbRes = await fetch(thumbnail);
    const thumbBuffer = await thumbRes.buffer();

    const audioRes = await fetch(audioUrl);
    const audioBuffer = await audioRes.buffer();

    // Send thumbnail & info
    await sock.sendMessage(m.chat, {
      image: thumbBuffer,
      caption: `🎧 *Title:* ${title}\n⏱ *Duration:* ${duration}\n\n_🔊 Powered by Huncho'
      
                  
    }, { quoted: m });

    // Send MP3 audio
    await sock.sendMessage(m.chat, {
      audio: audioBuffer,
      mimetype: 'audio/mpeg',
      ptt: false
    }, { quoted: m });

  } catch (err) {
    console.error('❌ Error in .hunchoplay:', err);
    await sock.sendMessage(m.chat, {
      text: `❌ Something went wrong while processing your request.`
    }, { quoted: m });
  }
};

export default popkidplay;
