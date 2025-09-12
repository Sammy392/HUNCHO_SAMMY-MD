const axios = require("axios");
const { cmd } = require("../command");

cmd({
  pattern: "mediafire",
  alias: ["mfire", "mfdownload"],
  react: '📥',
  desc: "Download files from MediaFire.",
  category: "download",
  use: ".mediafire <MediaFire URL>",
  filename: __filename
}, async (cmd, mek, m, { from, reply, args }) => {
  try {
    // Check if the user provided a MediaFire URL
    const mediafireUrl = args[0];
    if (!mediafireUrl || !mediafireUrl.includes("mediafire.com")) {
      return reply('Please provide a valid MediaFire URL. Example: `.mediafire https://mediafire.com/...`');
    }

    // Add a reaction to indicate processing
    await cmd.sendMessage(from, { react: { text: '⏳', key: m.key } });

    // Prepare the Velyn API URL
    const apiUrl = `https://velyn.vercel.app/api/downloader/mediafire?url=${encodeURIComponent(mediafireUrl)}`;

    // Call the Velyn API using GET
    const response = await axios.get(apiUrl);

    // Check if the API response is valid
    if (!response.data || !response.data.status || !response.data.data) {
      return reply('❌ Unable to fetch the file. Please check the URL and try again.');
    }

    // Extract the file details
    const { filename, size, mimetype, link } = response.data.data;

    // Inform the user that the file is being downloaded
    await reply(`📥 *Downloading ${filename} (${size})... Please wait.*`);

    // Download the file
    const fileResponse = await axios.get(link, { responseType: 'arraybuffer' });
    if (!fileResponse.data) {
      return reply('❌ Failed to download the file. Please try again later.');
    }

    // Prepare the file buffer
    const fileBuffer = Buffer.from(fileResponse.data, 'binary');

    // Send the file based on its MIME type
    if (mimetype.startsWith('image')) {
      // Send as image
      await cmd.sendMessage(from, {
        image: fileBuffer,
        caption: `📥 *File Details*\n\n` +
          `🔖 *Name*: ${filename}\n` +
          `📏 *Size*: ${size}\n\n` +
          `> 120363420342566562@newsletter`,
        contextInfo: {
          mentionedJid: [m.sender],
          forwardingScore: 999,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: '120363420342566562@newsletter',
            newsletterName: '『 huncho 』',
            serverMessageId: 143
          }
        }
      }, { quoted: mek });
    } else if (mimetype.startsWith('video')) {
      // Send as video
      await cmd.sendMessage(from, {
        video: fileBuffer,
        caption: `📥 *File Details*\n\n` +
          `🔖 *Name*: ${filename}\n` +
          `📏 *Size*: ${size}\n\n` +
          `> ᴍᴀᴅᴇ ʙʏ huncho`,
        contextInfo: {
          mentionedJid: [m.sender],
          forwardingScore: 999,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: '120363420342566562@newsletter',
            newsletterName: 'huncho',
            serverMessageId: 143
          }
        }
      }, { quoted: mek });
    } else {
      // Send as document
      await cmd.sendMessage(from, {
        document: fileBuffer,
        mimetype: mimetype,
        fileName: filename,
        caption: `📥 *File Details*\n\n` +
          `🔖 *Name*: ${filename}\n` +
          `📏 *Size*: ${size}\n\n` +
          `> ᴍᴀᴅᴇ ʙʏ huncho`,
        contextInfo: {
          mentionedJid: [m.sender],
          forwardingScore: 999,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: '120363420342566562@newsletter',
            newsletterName: 'huncho',
            serverMessageId: 143
          }
        }
      }, { quoted: mek });
    }

    // Add a reaction to indicate success
    await cmd.sendMessage(from, { react: { text: '✅', key: m.key } });
  } catch (error) {
    console.error('Error downloading file:', error);
    reply('❌ Unable to download the file. Please try again later.');

    // Add a reaction to indicate failure
    await cmd.sendMessage(from, { react: { text: '❌', key: m.key } });
  }
});


/// MEDIAFIRE 2

cmd({
  pattern: "mediafire2",
  alias: ["mfire2", "media"],
  react: '📂',
  desc: "Download files from MediaFire using Keith's API.",
  category: "download",
  use: ".mediafire2 <MediaFire URL>",
  filename: __filename
}, async (cmd, mek, m, { from, reply, args, q }) => {
  try {
    // Check if the user provided a URL
    if (!q) {
      return reply('Please provide a MediaFire URL. Example: `.mediafire2 https://www.mediafire.com/...`');
    }

    // Add a reaction to indicate processing
    await cmd.sendMessage(from, { react: { text: '⏳', key: m.key } });

    // Prepare the API URL
    const apiUrl = `https://apis-keith.vercel.app/download/mfire?url=${encodeURIComponent(q)}`;

    // Call the API using GET
    const response = await axios.get(apiUrl);

    // Check if the API response is valid
    if (!response.data || !response.data.status || !response.data.result || !response.data.result.dl_link) {
      return reply('❌ Unable to fetch the file. Please try again later.');
    }

    // Extract file details
    const { fileName, fileType, size, date, dl_link } = response.data.result;

    // Inform the user that the file is being downloaded
    await reply(`📂 *Downloading ${fileName}...*`);

    // Download the file
    const fileResponse = await axios.get(dl_link, { responseType: 'arraybuffer' });
    if (!fileResponse.data) {
      return reply('❌ Failed to download the file. Please try again later.');
    }

    // Send the file with emojis in the message content
    await cmd.sendMessage(from, {
      document: fileResponse.data,
      mimetype: fileType,
      fileName: fileName,
      caption: `📂 *File Name:* ${fileName}\n📦 *File Size:* ${size}\n📅 *Upload Date:* ${date}\n `,
      contextInfo: {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363420342566562@newsletter',
          newsletterName: '『 huncho 』',
          serverMessageId: 143
        }
      }
    }, { quoted: mek });

    // Add a reaction to indicate success
    await cmd.sendMessage(from, { react: { text: '✅', key: m.key } });
  } catch (error) {
    console.error('Error downloading file:', error);
    reply('❌ Unable to download the file. Please try again later.');

    // Add a reaction to indicate failure
    await cmd.sendMessage(from, { react: { text: '❌', key: m.key } });
  }
});

