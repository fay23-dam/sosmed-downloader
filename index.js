const express = require('express');
const {
  instagram, tikdown, ytdown,
  twitterdown, GDLink, pinterest, threads
} = require("nayan-media-downloader");
const getFBInfo = require("@xaviabot/fb-downloader");

const app = express();
app.use(express.json());
app.use(express.static(__dirname));

app.post('/download', async (req, res) => {
  const { url } = req.body;

  try {
    let finishResult = [];

    if (url.includes("instagram.com")) {
      const result = await instagram(url);
      if (result.data?.images)
        finishResult.push(...result.data.images.map(u => ({ url: u, type: "image" })));
      if (result.data?.video)
        finishResult.push(...result.data.video.map(u => ({ url: u, type: "video" })));
    }

    else if (url.includes("tiktok.com")) {
      const result = await tikdown(url);
      finishResult.push({ url: result.data.video, type: "video" });
    }

    else if (url.includes("youtube.com") || url.includes("youtu.be")) {
      const result = await ytdown(url);
      finishResult.push({ url: result.data.video_hd, type: "video" });
    }

    else if (url.includes("facebook.com") || url.includes("fb.watch")) {
      const result = await getFBInfo(url);
      finishResult.push({ url: result.hd, type: "video" });
    }

    res.json(finishResult.length ? finishResult : { error: "No data" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = app; // ⭐ WAJIB
