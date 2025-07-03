app.post('/api/command', async (req, res) => {
  const { command, jid } = req.body;

  if (command === "block") {
    try {
      await sock.updateBlockStatus(jid, "block");
      res.json({ status: "success", message: `✅ Blocked ${jid}` });
    } catch (error) {
      res.status(500).json({ status: "error", message: error.message });
    }
  } else {
    res.status(400).json({ status: "error", message: "Unknown command." });
  }
});
