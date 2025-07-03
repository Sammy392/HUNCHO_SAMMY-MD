import moment from "moment-timezone";
import config from "../../config.cjs";

const uptime = async (m, sock) => {
  try {
    const prefix = config.PREFIX || ".";
    const body = m.body || "";
    const cmd = body.startsWith(prefix) ? body.slice(prefix.length).trim().split(" ")[0].toLowerCase() : "";

    // Only respond to the exact command
    if (cmd !== "uptime") return;

    await m.React("⏳");

    // Calculate uptime
    const uptimeSec = process.uptime();
    const days = Math.floor(uptimeSec / 86400);
    const hours = Math.floor((uptimeSec % 86400) / 3600);
    const minutes = Math.floor((uptimeSec % 3600) / 60);
    const seconds = Math.floor(uptimeSec % 60);

    // Get current time in Nairobi timezone
    const currentTime = moment().tz("Africa/Nairobi").format("HH:mm:ss");
    let greeting = "Hello 👋";
    if (currentTime < "05:00:00") greeting = "Good Morning 🌄";
    else if (currentTime < "11:00:00") greeting = "Good Morning 🌄";
    else if (currentTime < "15:00:00") greeting = "Good Afternoon 🌅";
    else if (currentTime < "19:00:00") greeting = "Good Evening 🌆";
    else greeting = "Good Night 🌌";

    await m.React("⚡");

    await sock.sendMessage(m.from, {
      audio: { url: "https://files.catbox.moe/kiy0hl.jpg" },
      mimetype: "audio/mp4",
      ptt: true,
      contextInfo: {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "12036342066562@newsletter",
          newsletterName: "Huncho-Xmd",
          serverMessageId: 143
        },
        externalAdReply: {
          title: "🔥 Bot Status - Huncho",
          body: `${greeting} | UPTIME: ${days}D ${hours}H ${minutes}M ${seconds}S`,
          thumbnailUrl: "https://files.catbox.moe/kiy0hl.jpg",
          sourceUrl: "https://whatsapp.com/channel/0029Vb61XuIKgsNt6yv9Sc2y",
          mediaType: 1,
          renderLargerThumbnail: true,
        },
      },
    }, { quoted: m });

  } catch (err) {
    console.error("Uptime command error:", err);
    await m.reply("❌ Error while fetching uptime.");
  }
};

export default uptime;
