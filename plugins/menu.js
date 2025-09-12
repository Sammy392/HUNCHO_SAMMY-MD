// ──────── IMPORTS ─────────
const os = require("os");
const moment = require("moment-timezone");
const config = require("../config");
const { cmd, commands } = require("../command");
const { getPrefix } = require("../lib/prefix");

// ──────── HELPERS ─────────
const stylizeText = (txt) => {
  const fontMap = {
    A: "ᴀ", B: "ʙ", C: "ᴄ", D: "ᴅ", E: "ᴇ", F: "ғ", G: "ɢ", H: "ʜ",
    I: "ɪ", J: "ᴊ", K: "ᴋ", L: "ʟ", M: "ᴍ", N: "ɴ", O: "ᴏ", P: "ᴘ",
    Q: "ǫ", R: "ʀ", S: "ꜱ", T: "ᴛ", U: "ᴜ", V: "ᴠ", W: "ᴡ", X: "x",
    Y: "ʏ", Z: "ᴢ"
  };
  return [...txt].map(c => fontMap[c.toUpperCase()] || c).join("");
};

const tidyCategory = (name) =>
  name.toLowerCase().replace(/\s+menu$/, "").trim();

const categoryIcons = {
  ai: "🤖", anime: "🍥", audio: "🎧", bible: "📖",
  download: "⬇️", downloader: "📥", fun: "🎮", game: "🕹️",
  group: "👥", img_edit: "🖌️", info: "ℹ️", information: "🧠",
  logo: "🖼️", main: "🏠", media: "🎞️", menu: "📜", misc: "📦",
  music: "🎵", other: "📁", owner: "👑", privacy: "🔒",
  search: "🔎", settings: "⚙️", sticker: "🌟", tools: "🛠️",
  user: "👤", utilities: "🧰", utility: "🧮", wallpapers: "🖼️",
  whatsapp: "📱"
};

const formatRuntime = () => {
  const total = process.uptime();
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = Math.floor(total % 60);
  return `${h}h ${m}m ${s}s`;
};

// ──────── COMMAND ─────────
cmd(
  {
    pattern: "menu",
    alias: ["allmenu"],
    desc: "Show all bot commands",
    category: "menu",
    react: "👌",
    filename: __filename
  },

  async (conn, mek, m, { from, sender, reply }) => {
    try {
      const prefix = getPrefix();
      const tz = config.TIMEZONE || "Africa/Nairobi";
      const now = moment().tz(tz);

      // ── Header
      let caption = `
╭─────────────✦
│   🚀 ${stylizeText("HUNCHO")}
╰─────────────✦

👤 *User:* @${sender.split("@")[0]}
🕒 *Uptime:* ${formatRuntime()}
⚙️ *Mode:* ${config.MODE}
🔑 *Prefix:* ${config.PREFIX}
👑 *Owner:* ${config.OWNER_NAME}
📦 *Plugins:* ${commands.length}
💻 *Developer:* ᴘᴏᴘᴋɪᴅ
🆚 *Version:* 2.0.0
─────────────────────`;

      // ── Group Commands
      const grouped = {};
      for (let c of commands) {
        if (!c.pattern || !c.category || c.dontAdd) continue;
        const clean = tidyCategory(c.category);
        grouped[clean] = grouped[clean] || [];
        grouped[clean].push(c.pattern.split("|")[0]);
      }

      // ── Add Categories
      Object.keys(grouped)
        .sort()
        .forEach((cat) => {
          const icon = categoryIcons[cat] || "📂";
          caption += `\n\n📂 [${icon} ${stylizeText(cat)} ${stylizeText("Menu")}]\n`;
          grouped[cat].sort().forEach((cmd) => {
            caption += `  • ${prefix}${cmd}\n`;
          });
        });

      // ── Footer
      caption += `\n─────────────────────
✨ ${config.DESCRIPTION || stylizeText("Explore the bot commands and enjoy 🚀")}`;

      const ctxInfo = {
        mentionedJid: [sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid:
            config.NEWSLETTER_JID || "120363418305362813@newsletter",
          newsletterName: config.OWNER_NAME || stylizeText("HUNCHO"),
          serverMessageId: 143
        }
      };

      // ── Send Menu
      await conn.sendMessage(
        from,
        {
          image: {
            url:
              config.MENU_IMAGE_URL ||
              "https://files.catbox.moe/tbdd5d.jpg"
          },
          caption,
          contextInfo: ctxInfo
        },
        { quoted: mek }
      );

      // ── Optional Audio
      if (config.MENU_AUDIO_URL) {
        await new Promise((r) => setTimeout(r, 1000));
        await conn.sendMessage(
          from,
          {
            audio: { url: config.MENU_AUDIO_URL },
            mimetype: "audio/mp4",
            ptt: true,
            contextInfo: ctxInfo
          },
          { quoted: mek }
        );
      }
    } catch (err) {
      console.error("Menu Error:", err.message);
      await reply(
        `❌ ${stylizeText("Error")}: Failed to show menu.\n${stylizeText(
          "Details"
        )}: ${err.message}`
      );
    }
  }
);
