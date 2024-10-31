const {instagram} = require("nayan-media-downloader");

const link = "https://www.instagram.com/p/C6jPgiixcJj/?utm_source=ig_web_copy_link" //past video link

  instagram(link).then(data => {

    console.log(data)

});