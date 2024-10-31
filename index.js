const express = require('express');
const { instagram, tikdown, ytdown, twitterdown, GDLink, pinterest, threads } = require("nayan-media-downloader");
const getFBInfo = require("@xaviabot/fb-downloader");
const app = express();
app.use(express.json());

app.use(express.static(__dirname)); // Serve the HTML file
async function fetchImageWithHeaders(url) {
    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36'
            }
        });
        if (response.ok) return response.url; // Return the direct image URL if accessible
        return null; // Return null if image fetch failed
    } catch (error) {
        console.error("Error fetching image:", error);
        return null;
    }
}
app.post('/download', async (req, res) => {
    const { url } = req.body;

    try {
        let result;
        let finishResult = []; // Initialize an array to hold the media information

        if (url.includes("instagram.com")) {
            result = await instagram(url);
        
            // Check for both images and videos
            if (result.data?.images && result.data.images.length > 0) {
                finishResult = finishResult.concat(result.data.images.map(link => ({ url: link, type: "image" })));
            }
            if (result.data?.video && result.data.video.length > 0) {
                finishResult = finishResult.concat(result.data.video.map(link => ({ url: link, type: "video" })));
            }
        }
        else if (url.includes("tiktok.com")) {
            result = await tikdown(url);
            finishResult.push({ url: result.data.video, type: "video" });
        } else if (url.includes("youtube.com") || url.includes("youtu.be")) {
            result = await ytdown(url);
            finishResult.push({ url: result.data.video_hd, type: "video" });
        } else if (url.includes("twitter.com") || url.includes("x.com")) {
            result = await twitterdown(url);
            finishResult.push({ url: result.data.HD, type: "video" });
        } else if (url.includes("drive.google.com")) {
            result = await GDLink(url);
            finishResult = result.data.links.map(link => ({ url: link, type: "file" })); // Assuming it's a file link
        } else if (url.includes("pinterest.com")) {
            result = await pinterest(url);
            finishResult = result.data.images.map(link => ({ url: link, type: "image" }));
        } else if (url.includes("threads.net")) {
            result = await threads(url);
            finishResult = result.data.images.map(link => ({ url: link, type: "image" }));
        } else if(url.includes("facebook.com") || url.includes("fb.watch")) {
            const result = await getFBInfo(url);
            finishResult.push({ url: result.hd, type: "video" });
            console.log("Result:", result);
        }

        console.log(finishResult);
        res.json(finishResult.length > 0 ? finishResult : { error: 'No download links available.' });
    } catch (error) {
        res.json({ error: error.message });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
