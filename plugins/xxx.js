const { cmd } = require('../command');
const axios = require('axios');

// Configure axios
const axiosInstance = axios.create({
  timeout: 20000,
  maxRedirects: 5
});

cmd(
  {
    pattern: 'xvideo',
    alias: ['hentai', 'xnxx','xxx'],
    desc: '🔞 Download 18+ videos from Xvideos',
    category: 'media',
    react: '🔞',
    use: '<search query>',
    filename: __filename,
  },
  async (cmd, mek, m, { text, reply }) => {
    try {
      // Ensure we have a search term
      if (!text) {
        await reply('🔞 *Usage:* .xvideo <search query>\nExample: .xvideo big boobs');
        return;
      }

      // Show loading reaction
      await cmd.sendMessage(mek.chat, { react: { text: '⏳', key: mek.key } });

      // Query Dracula Xvideos API
      const apiUrl = `https://draculazyx-xyzdrac.hf.space/api/Xvideos?q=${encodeURIComponent(text.trim())}`;
      const { data } = await axiosInstance.get(apiUrl);

      // Check for a valid video
      if (data.STATUS !== 200 || !data.video?.downloadLink) {
        await cmd.sendMessage(mek.chat, { react: { text: '❌', key: mek.key } });
        await reply('🔞 No results found or API error');
        return;
      }

      const { title, imageUrl, videoUrl, downloadLink } = data.video;

      // Attempt to fetch thumbnail
      let thumbBuf = null;
      try {
        const thumbRes = await axiosInstance.get(imageUrl, { responseType: 'arraybuffer' });
        thumbBuf = Buffer.from(thumbRes.data);
      } catch { /* silent thumbnail failure */ }

      // Send thumbnail preview with link
      await cmd.sendMessage(
        mek.chat,
        {
          image: thumbBuf,
          caption: `🔞 *${title}*\n🔗 ${videoUrl}`,
          contextInfo: {
            externalAdReply: {
              title,
              body: 'ᴍᴀᴅᴇ ʙʏ huncho',
              mediaType: 1,
              thumbnail: thumbBuf,
              mediaUrl: videoUrl,
              sourceUrl: videoUrl
            }
          }
        },
        { quoted: mek }
      );

      // Download the video
      const videoRes = await axiosInstance.get(downloadLink, {
        responseType: 'arraybuffer',
        headers: { Referer: 'https://www.xvideos.com/' }
      });
      const videoBuf = Buffer.from(videoRes.data);

      // Sanitize filename and send video
      const safeTitle = title.replace(/[\\/:"*?<>|]/g, '').slice(0, 50) || 'video';
      await cmd.sendMessage(
        mek.chat,
        {
          video: videoBuf,
          mimetype: 'video/mp4',
          fileName: `${safeTitle}.mp4`,
          caption: `📹 ${title}`
        }
      );

      // All done!
      await cmd.sendMessage(mek.chat, { react: { text: '✅', key: mek.key } });

    } catch (error) {
      // React and reply with error message
      await cmd.sendMessage(mek.chat, { react: { text: '❌', key: mek.key } });
      await reply(`🔞 Error: ${error.message || 'Please try again later'}`);
    }
  }
);
