const { cmd } = require("../command");

//
// 🆙 Promote
//
cmd({
  pattern: "promote1",
  desc: "Promote a member to admin",
  category: "group",
  react: "🆙",
  filename: __filename
}, async (conn, mek, m, { from, args }) => {
  try {
    if (!mek.key.remoteJid.endsWith("@g.us"))
      return await conn.sendMessage(from, { text: "❌ Group only." }, { quoted: mek });

    let target;
    if (mek.message.extendedTextMessage?.contextInfo?.mentionedJid) {
      target = mek.message.extendedTextMessage.contextInfo.mentionedJid[0];
    } else if (args[0]) {
      target = args[0].replace(/[^0-9]/g, "") + "@s.whatsapp.net";
    } else {
      return await conn.sendMessage(from, { text: "❌ Mention or type number." }, { quoted: mek });
    }

    await conn.groupParticipantsUpdate(from, [target], "promote");
    await conn.sendMessage(from, { text: `✅ Promoted @${target.split("@")[0]} to admin!`, mentions: [target] }, { quoted: mek });
  } catch (err) {
    console.error(err);
    await conn.sendMessage(from, { text: "❌ Failed to promote user." }, { quoted: mek });
  }
});

//
// 🔽 Demote
//
cmd({
  pattern: "demote1",
  desc: "Demote an admin to member",
  category: "group",
  react: "🔽",
  filename: __filename
}, async (conn, mek, m, { from, args }) => {
  try {
    if (!mek.key.remoteJid.endsWith("@g.us"))
      return await conn.sendMessage(from, { text: "❌ Group only." }, { quoted: mek });

    let target;
    if (mek.message.extendedTextMessage?.contextInfo?.mentionedJid) {
      target = mek.message.extendedTextMessage.contextInfo.mentionedJid[0];
    } else if (args[0]) {
      target = args[0].replace(/[^0-9]/g, "") + "@s.whatsapp.net";
    } else {
      return await conn.sendMessage(from, { text: "❌ Mention or type number." }, { quoted: mek });
    }

    await conn.groupParticipantsUpdate(from, [target], "demote");
    await conn.sendMessage(from, { text: `✅ Demoted @${target.split("@")[0]} to member!`, mentions: [target] }, { quoted: mek });
  } catch (err) {
    console.error(err);
    await conn.sendMessage(from, { text: "❌ Failed to demote user." }, { quoted: mek });
  }
});

//
// 🚪 Kick
//
cmd({
  pattern: "kick1",
  desc: "Remove a member from the group",
  category: "group",
  react: "🚪",
  filename: __filename
}, async (conn, mek, m, { from, args }) => {
  try {
    if (!mek.key.remoteJid.endsWith("@g.us"))
      return await conn.sendMessage(from, { text: "❌ Group only." }, { quoted: mek });

    let target;
    if (mek.message.extendedTextMessage?.contextInfo?.mentionedJid) {
      target = mek.message.extendedTextMessage.contextInfo.mentionedJid[0];
    } else if (args[0]) {
      target = args[0].replace(/[^0-9]/g, "") + "@s.whatsapp.net";
    } else {
      return await conn.sendMessage(from, { text: "❌ Mention or type number." }, { quoted: mek });
    }

    await conn.groupParticipantsUpdate(from, [target], "remove");
    await conn.sendMessage(from, { text: `✅ Kicked @${target.split("@")[0]} from the group!`, mentions: [target] }, { quoted: mek });
  } catch (err) {
    console.error(err);
    await conn.sendMessage(from, { text: "❌ Failed to kick user." }, { quoted: mek });
  }
});

//
// ➕ Add
//
cmd({
  pattern: "add1",
  desc: "Add a member to the group",
  category: "group",
  react: "➕",
  filename: __filename
}, async (conn, mek, m, { from, args }) => {
  try {
    if (!mek.key.remoteJid.endsWith("@g.us"))
      return await conn.sendMessage(from, { text: "❌ Group only." }, { quoted: mek });

    if (!args[0]) return await conn.sendMessage(from, { text: "❌ Provide a number. Example: .add 254700000000" }, { quoted: mek });

    let number = args[0].replace(/[^0-9]/g, "");
    let target = number + "@s.whatsapp.net";

    await conn.groupParticipantsUpdate(from, [target], "add");
    await conn.sendMessage(from, { text: `✅ Added @${number} to the group!`, mentions: [target] }, { quoted: mek });
  } catch (err) {
    console.error(err);
    await conn.sendMessage(from, { text: "❌ Failed to add user (maybe number not on WhatsApp)." }, { quoted: mek });
  }
});
