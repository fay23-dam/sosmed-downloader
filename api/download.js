const { instagram, tikdown, ytdown, twitterdown, GDLink, pinterest, threads } = require("nayan-media-downloader");
const getFBInfo = require("@xaviabot/fb-downloader");

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    const { url } = req.body;
    try {
        let result;
        let finishResult = [];

        if (url.includes("instagram.com")) {
            result = await instagram(url);
            if (result.data?.images) {
                finishResult = finishResult.concat(result.data.images.map(link => ({ url: link, type: "image" })));
            }
            if (result.data?.video) {
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
            finishResult = result.data.links.map(link => ({ url: link, type: "file" }));
        } else if (url.includes("pinterest.com")) {
            result = await pinterest(url);
            finishResult = result.data.images.map(link => ({ url: link, type: "image" }));
        } else if (url.includes("threads.net")) {
            result = await threads(url);
            finishResult = result.data.images.map(link => ({ url: link, type: "image" }));
        } else if(url.includes("facebook.com") || url.includes("fb.watch")) {
            result = await getFBInfo(url);
            finishResult.push({ url: result.hd, type: "video" });
        }

        res.json(finishResult.length > 0 ? finishResult : { error: 'No download links available.' });
    } catch (error) {
        res.json({ error: error.message });
    }
};
