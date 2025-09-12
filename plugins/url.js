const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { cmd } = require("../command");

// API keys — replace with your own
const API_KEYS = [
  "40dfb24c7b48ba51487a9645abf33148",
  "4a9c3527b0cd8b12dd4d8ab166a0f592",
  "0e2b3697320c339de00589478be70c48",
  "7b46d3cddc9b67ef690ed03dce9cb7d5"
];

cmd({
  pattern: "tourl",
  alias: ["imgtourl", "imgurl", "url", "uploadimg"],
  react: "🔄",
  desc: "Convert an image to a URL using ImgBB.",
  category: "utility",
  use: ".tourl (reply to an image)",
  filename: __filename
}, async (cmd, mek, m, { reply }) => {
  try {
    const quoted = m.quoted || m;
    const mime = (quoted.msg || quoted).mimetype || "";

    if (!mime.startsWith("image")) {
      return reply("*[❗] Oops! Reply to an image*");
    }

    const buffer = await quoted.download();
    const filePath = path.join(os.tmpdir(), "huncho.jpg");
    fs.writeFileSync(filePath, buffer);

    let imageUrl, lastError;
    for (const apiKey of API_KEYS) {
      try {
        const form = new FormData();
        form.append("image", fs.createReadStream(filePath));

        const res = await axios.post("https://api.imgbb.com/1/upload", form, {
          params: { key: apiKey },
          headers: form.getHeaders()
        });

        imageUrl = res?.data?.data?.url;
        if (!imageUrl) throw new Error("No URL returned");
        break;
      } catch (err) {
        lastError = err;
        console.error(`ImgBB key failed [${apiKey}]:`, err.message);
      }
    }

    fs.unlinkSync(filePath);

    if (!imageUrl) throw lastError;

    reply(
      `\`✅ IMAGE UPLOADED SUCCESSFULLY!\`\n\n` +
      `📂 *File Size:* ${buffer.length} bytes\n` +
      `🔗 *URL:* ${imageUrl}\n\n` +
      `> ᴍᴀᴅᴇ ʙʏ ᴘᴏᴘᴋɪᴅ`
    );
  } catch (e) {
    console.error("tourl error:", e);
    reply(`❌ Error: ${e.message || e}`);
  }
});


cmd({
  pattern: "tourl2",
  alias: ["imgtourl2", "imgurl2", "url2", "geturl2", "upload"],
  react: "📤",
  desc: "Upload media to Catbox and return a direct URL.",
  category: "utility",
  use: ".tourl2 (reply to media)",
  filename: __filename
}, async (client, m, args, { reply }) => {
  try {
    const q = m.quoted || m;
    const mime = (q.msg || q).mimetype || "";
    if (!mime) throw "❌ Reply to image, audio or video.";

    const buffer = await q.download();
    const ext = mime.includes("image/jpeg") ? ".jpg" :
                mime.includes("png") ? ".png" :
                mime.includes("video") ? ".mp4" :
                mime.includes("audio") ? ".mp3" : "";
    const name = `file${ext}`;
    const tmp = path.join(os.tmpdir(), `catbox_${Date.now()}${ext}`);
    fs.writeFileSync(tmp, buffer);

    const form = new FormData();
    form.append("fileToUpload", fs.createReadStream(tmp), name);
    form.append("reqtype", "fileupload");

    const res = await axios.post("https://catbox.moe/user/api.php", form, {
      headers: form.getHeaders()
    });

    if (!res.data) throw "Upload failed.";

    fs.unlinkSync(tmp);

    const type = mime.includes("image") ? "Image" :
                 mime.includes("video") ? "Video" :
                 mime.includes("audio") ? "Audio" : "File";

    reply(
      `*✅ ${type} Uploaded!*\n\n` +
      `📁 *Size:* ${formatBytes(buffer.length)}\n` +
      `🔗 *URL:* ${res.data}\n\n` +
      `> © ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴘᴏᴘᴋɪᴅ`
    );
  } catch (e) {
    console.error("tourl2 error:", e);
    reply(`❌ ${e.message || e}`);
  }
});

function formatBytes(bytes) {
  if (!bytes) return "0 Bytes";
  const k = 1024, sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}


cmd({
  pattern: "docanalyze",
  alias: ["analyzedoc", "docai", "askdoc"],
  react: "📄",
  desc: "Upload document and ask AI about its contents.",
  category: "utility",
  use: ".docanalyze [your question] [reply to doc]",
  filename: __filename
}, async (client, m, args, { reply }) => {
  try {
    const q = m.quoted || m;
    const mime = (q.msg || q).mimetype || "";
    if (!mime || !/pdf|word|doc|openxml/i.test(mime)) {
      throw "Reply to a PDF or Word document.";
    }

    const question = args.join(" ") || "Summarize this document";
    const buffer = await q.download();
    const ext = mime.includes("pdf") ? ".pdf" : mime.includes("word") ? ".doc" : ".docx";
    const name = `document${ext}`;
    const tmp = path.join(os.tmpdir(), `doc_${Date.now()}${ext}`);
    fs.writeFileSync(tmp, buffer);

    const form = new FormData();
    form.append("fileToUpload", fs.createReadStream(tmp), name);
    form.append("reqtype", "fileupload");

    const catbox = await axios.post("https://catbox.moe/user/api.php", form, {
      headers: form.getHeaders()
    });

    if (!catbox.data) throw "Catbox upload failed.";
    fs.unlinkSync(tmp);

    const docUrl = catbox.data;
    const encodedQ = encodeURIComponent(question);
    const encodedUrl = encodeURIComponent(docUrl);
    const geminiRes = await axios.get(`https://bk9.fun/ai/GeminiDocs?q=${encodedQ}&url=${encodedUrl}`);
    
    const result = geminiRes.data;

    reply(
      `*📄 Document Analysis*\n\n` +
      `❓ *Question:* ${question}\n` +
      `🔗 *Doc URL:* ${docUrl}\n\n` +
      `🧠 *AI Response:*\n${result.BK9 || result.response || "No answer."}\n\n` +
      `> ᴍᴀᴅᴇ ʙʏ huncho`
    );
  } catch (e) {
    console.error("docanalyze error:", e);
    reply(`❌ ${e.message || e}`);
  }
});
