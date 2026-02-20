import express from "express";

const app = express();
const PORT = 3001;

app.get("/api/skin", async (req, res) => {
  try {
    const imageUrl = req.query.url;

    if (!imageUrl) {
      return res.status(400).send("Missing url parameter");
    }

    // 🔒 Whitelist domain
    if (!imageUrl.startsWith("https://www.minecraftskins.com/")) {
      return res.status(403).send("Forbidden domain");
    }

    const response = await fetch(imageUrl);

    if (!response.ok) {
      return res.status(500).send("Failed to fetch image");
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    res.setHeader("Content-Type", "image/png");
    res.setHeader("Access-Control-Allow-Origin", "*");

    res.send(buffer);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

app.listen(PORT, () => {
  console.log(`Proxy running on http://localhost:${PORT}`);
});
