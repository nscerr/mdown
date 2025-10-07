const cheerio = require('cheerio');

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

const parseHtmlLinks = (htmlContent) => {
    const $ = cheerio.load(htmlContent);
    const downloadLinks = [];
    $('a').each((i, elem) => {
        const linkClass = $(elem).attr('class');
        if (linkClass && linkClass.includes('download')) {
            const qualityText = $(elem).text().trim();
            if (qualityText.toLowerCase().includes("audio")) return;

            const quality = $(elem).attr('title') ? $(elem).attr('title').replace("Download", "").trim() : 'Kualitas Tidak Diketahui';
            const href = $(elem).attr('href');
            if (href && quality) {
                downloadLinks.push({ quality, url: href });
            }
        }
    });
    return downloadLinks;
}

const generateCfToken = () => {
    const jwtChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
    const randomString = (length) => Array.from({ length }, () => jwtChars.charAt(Math.floor(Math.random() * jwtChars.length))).join('');
    return `JWT.${randomString(36)}.${randomString(138)}.${randomString(43)}`;
}

module.exports = { sleep, getRandomElement, parseHtmlLinks, generateCfToken };
