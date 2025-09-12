const axios = require("axios");
const config = require('../config');
const { cmd } = require("../command");

cmd({
  pattern: "tiktok",
  alias: ["tt", "tiktokdl"],
  react: '📥',
  desc: "Download TikTok video",
  category: "download",
  use: ".tiktok <url>",
  filename: __filename
}, async (cmd, m, mek, { from, args, reply }) => {
  const tiktokUrl = args[0];

  if (!tiktokUrl || !tiktokUrl.includes("tiktok.com")) {
    return reply("❌ Please provide a valid TikTok URL.");
  }

  try {
    await cmd.sendMessage(from, { react: { text: '⏳', key: m.key } });

    // Try primary API
    let data;
    try {
      const res = await axios.get(`https://api.nexoracle.com/downloader/tiktok-nowm?apikey=free_key@maher_apis&url=${encodeURIComponent(tiktokUrl)}`);
      if (res.data?.status === 200) data = res.data.result;
    } catch (_) {}

    // Fallback API
    if (!data) {
      const fallback = await axios.get(`https://api.tikwm.com/?url=${encodeURIComponent(tiktokUrl)}&hd=1`);
      if (fallback.data?.data) {
        const r = fallback.data.data;
        data = {
          title: r.title,
          author: {
            username: r.author.unique_id,
            nickname: r.author.nickname
          },
          metrics: {
            digg_count: r.digg_count,
            comment_count: r.comment_count,
            share_count: r.share_count,
            download_count: r.download_count
          },
          url: r.play,
          thumbnail: r.cover
        };
      }
    }

    if (!data) return reply("❌ TikTok video not found.");

    const { title, author, url, metrics, thumbnail } = data;

    const caption = `🎬 *TikTok Downloader*\n
╭─❍ huncho-xmd ❍
┊🎵 *Title:* ${title}
┊👤 *Author:* @${author.username} (${author.nickname})
┊❤️ *Likes:* ${metrics.digg_count}
┊💬 *Comments:* ${metrics.comment_count}
┊🔁 *Shares:* ${metrics.share_count}
┊📥 *Downloads:* ${metrics.download_count}
╰─❍
> ${config.FOOTER || "ᴍᴀᴅᴇ ʙʏ huncho"}`;

    await cmd.sendMessage(from, {
      image: { url: thumbnail },
      caption
    }, { quoted: mek });

    // Direct video download
    const loading = await cmd.sendMessage(from, { text: '⏳ Downloading video...' }, { quoted: mek });
    const videoBuffer = Buffer.from((await axios.get(url, { responseType: 'arraybuffer' })).data, 'binary');

    await cmd.sendMessage(from, {
      video: videoBuffer,
      caption: `🎥 Video by @${author.username}`
    }, { quoted: mek });

    await cmd.sendMessage(from, { text: "✅ Video sent!", edit: loading.key });

  } catch (err) {
    console.error("❌ Download error:", err);
    await reply("❌ Failed to download TikTok video.");
  }
});
