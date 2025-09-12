
const axios = require("axios");
const { cmd } = require("../command");

cmd({
  pattern: "fbdl",
  alias: ["facebook", "fbvideo","fb"],
  react: '📥',
  desc: "Download videos from Facebook.",
  category: "download",
  use: ".fbdl <Facebook video URL>",
  filename: __filename
}, async (conn, mek, m, { from, reply, args }) => {
  try {
    // Check if the user provided a Facebook video URL
    const fbUrl = args[0];
    if (!fbUrl || !fbUrl.includes("facebook.com")) {
      return reply('Please provide a valid Facebook video URL. Example: `.fbdl https://facebook.com/...`');
    }

    // Add a reaction to indicate processing
    await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

    // Prepare the primary API URL
    const primaryApiUrl = `https://apis.davidcyriltech.my.id/facebook2?url=${encodeURIComponent(fbUrl)}`;
    
    // Prepare fallback APIs
    const fallbackApis = [
      `https://kaiz-apis.gleeze.com/api/fbdl?url=${encodeURIComponent(fbUrl)}&apikey=cf2ca612-296f-45ba-abbc-473f18f991eb`,
      `https://api.giftedtech.web.id/api/download/facebook?apikey=gifted&url=${encodeURIComponent(fbUrl)}`
    ];

    let videoData = null;
    let apiIndex = 0;
    const apis = [primaryApiUrl, ...fallbackApis];

    // Try each API until we get a successful response
    while (apiIndex < apis.length && !videoData) {
      try {
        const response = await axios.get(apis[apiIndex]);
        
        // Parse response based on which API responded
        if (apiIndex === 0) {
          // Primary API response format
          if (response.data && response.data.status && response.data.video) {
            const { title, thumbnail, downloads } = response.data.video;
            videoData = {
              title: title || "Facebook Video",
              thumbnail,
              downloadUrl: downloads.find(d => d.quality === "HD")?.downloadUrl || downloads[0].downloadUrl,
              quality: downloads.find(d => d.quality === "HD") ? "HD" : "SD"
            };
          }
        } else if (apiIndex === 1) {
          // Kaiz API response format
          if (response.data && response.data.videoUrl) {
            videoData = {
              title: response.data.title || "Facebook Video",
              thumbnail: response.data.thumbnail,
              downloadUrl: response.data.videoUrl,
              quality: response.data.quality || "HD"
            };
          }
        } else if (apiIndex === 2) {
          // GiftedTech API response format
          if (response.data && response.data.success && response.data.result) {
            const result = response.data.result;
            videoData = {
              title: result.title || "Facebook Video",
              thumbnail: result.thumbnail,
              downloadUrl: result.hd_video || result.sd_video,
              quality: result.hd_video ? "HD" : "SD"
            };
          }
        }
      } catch (error) {
        console.error(`Error with API ${apiIndex}:`, error.message);
      }
      apiIndex++;
    }

    if (!videoData) {
      return reply('❌ All download services failed. Please try again later.');
    }

    // Inform the user that the video is being downloaded
    await reply('```Downloading video... Please wait.📥```');

    // Download the video
    const videoResponse = await axios.get(videoData.downloadUrl, { responseType: 'arraybuffer' });
    if (!videoResponse.data) {
      return reply('❌ Failed to download the video. Please try again later.');
    }

    // Prepare the video buffer
    const videoBuffer = Buffer.from(videoResponse.data, 'binary');

    // Send the video with details
    await conn.sendMessage(from, {
      video: videoBuffer,
      caption: `📥 *ᴠɪᴅᴇᴏ ᴅᴇᴛᴀɪʟs*\n\n` +
        `🔖 *ᴛɪᴛʟᴇ*: ${videoData.title}\n` +
        `📏 *ǫᴜᴀʟɪᴛʏ*: ${videoData.quality}\n\n` +
        `> ᴍᴀᴅᴇ ʙʏ ᴘᴏᴘᴋɪᴅ xᴛʀ`,
      contextInfo: {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363420342566562@newsletter',
          newsletterName: 'huncho xtr',
          serverMessageId: 143
        }
      }
    }, { quoted: mek });

    // Add a reaction to indicate success
    await conn.sendMessage(from, { react: { text: '✅', key: m.key } });
  } catch (error) {
    console.error('Error downloading video:', error);
    reply('❌ Unable to download the video. Please try again later.');

    // Add a reaction to indicate failure
    await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
  }
});
