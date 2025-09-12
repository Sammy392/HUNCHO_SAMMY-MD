const { cmd } = require("../command");
const axios = require("axios");
const ytSearch = require("yt-search"); 

cmd({
  pattern: "video",
  alias: ["ytmp4", "v"],
  desc: "Download YouTube videos by name or keyword",
  category: "media",
  react: "🎬",
  filename: __filename
}, async (conn, mek, m, { from, q }) => {
  if (!q) {
    return await conn.sendMessage(from, { 
      text: "❌ Please provide a video name or keyword!" 
    }, { quoted: mek });
  }

  try {
    // React search
    await conn.sendMessage(from, { react: { text: "🔍", key: mek.key } });

    // 🔎 Search YouTube
    const searchResult = await ytSearch(q);
    const video = searchResult.videos?.[0];
    if (!video) throw new Error("No video found");

    let downloadInfo;

    // Primary API
    try {
      const res = await axios.get(
        "https://apis.davidcyriltech.my.id/download/ytmp4?url=" +
          encodeURIComponent(video.url)
      );
      const data = res.data.result;
      if (!data?.download_url) throw new Error("Primary failed");

      downloadInfo = {
        title: data.title,
        thumbnail: data.thumbnail,
        download_url: data.download_url,
        quality: data.quality || "Unknown",
      };
    } catch {
      // Fallback API
      const res = await axios.get(
        "https://iamtkm.vercel.app/downloaders/ytmp4?url=" +
          encodeURIComponent(video.url)
      );
      const data = res.data?.data;
      if (!data?.url) throw new Error("Fallback failed");

      downloadInfo = {
        title: data.title || video.title,
        thumbnail: video.thumbnail,
        download_url: data.url,
        quality: "Unknown (fallback)",
      };
    }

    // 🎞️ Send preview
    await conn.sendMessage(from, {
      image: { url: downloadInfo.thumbnail },
      caption: `╭────「 *🎬 Video Preview* 」\n` +
               `│  📌 Title: ${downloadInfo.title}\n` +
               `│  ⏱️ Duration: ${video.timestamp}\n` +
               `│  👁️ Views: ${video.views}\n` +
               `│  📺 Quality: ${downloadInfo.quality}\n` +
               `│  📅 Published: ${video.ago}\n` +
               `╰───────────────⊷`,
      contextInfo: {
        externalAdReply: {
          title: "huncho xᴍᴅ ᴠɪᴅᴇᴏ",
          body: "Streaming via huncho XMD Bot",
          thumbnailUrl: "https://files.catbox.moe/cwuypf.jpg",
          sourceUrl: video.url,
          mediaType: 1,
          renderLargerThumbnail: true,
        },
      },
    }, { quoted: mek });

    // 🎥 Send actual video
    await conn.sendMessage(from, {
      video: { url: downloadInfo.download_url },
      mimetype: "video/mp4",
      caption: "🎥 ᴘᴏᴡᴇʀᴇᴅ ʙʏ huncho xᴍᴅ ʙᴏᴛ\nStreaming now ↻ ◁ II ▷ ↺",
      contextInfo: {
        externalAdReply: {
          title: "ᴘᴏᴘᴋɪᴅ xᴍᴅ ʙᴏᴛ",
          body: "Streaming now ↻ ◁ II ▷ ↺",
          thumbnailUrl: downloadInfo.thumbnail,
          sourceUrl: video.url,
          mediaType: 1,
          renderLargerThumbnail: true,
        },
      },
    }, { quoted: mek });

    // ✅ React success
    await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

  } catch (err) {
    console.error(err);
    await conn.sendMessage(from, { 
      text: "❌ An unexpected error occurred! Try again later." 
    }, { quoted: mek });
    await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
  }
});
