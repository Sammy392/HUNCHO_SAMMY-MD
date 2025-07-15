export default async function (m, sock) {
  const text = m.body?.toLowerCase();

  if (text === ".hi") {
    await sock.sendMessage(m.chat, {
      text: "Hello! I'm Huncho Bot 🔥"
    });
  }
}
