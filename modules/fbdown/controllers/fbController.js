const axios = require('axios');
const { USER_AGENTS, API_ENDPOINTS } = require('../utils/config');
const { sleep, getRandomElement, parseHtmlLinks, generateCfToken } = require('../utils/helpers');
const endpointsToTry = [...API_ENDPOINTS];
const getFacebookDownloadLinks = async (req, res) => {
    const { url: videoUrl } = req.query;

    // Validasi input
    if (!videoUrl) {
        return res.status(400).json({ 
            status: "Gagal",
            sumber: "API_Gateway",
            pesan: "Parameter 'url' wajib diisi." 
        });
    }

    // Acak urutan array tersebut untuk mendistribusikan beban
    endpointsToTry.sort(() => Math.random() - 0.5);

    // Gunakan array yang sudah diacak di dalam loop
    for (const endpoint of endpointsToTry) {
        console.log(`[fbdown] Mencoba melalui: ${endpoint.name}...`);
        try {
            // Logika kondisional untuk memilih handler (saat ini hanya ada TIPE_A)
            if (endpoint.handler === 'TIPE_A') {
                const headers = { 'User-Agent': getRandomElement(USER_AGENTS) };
                console.log(`[fbdown] User-Agent: ${headers['User-Agent'].substring(0, 70)}...`);
                const payload = { ...endpoint.payload, q: videoUrl };

                // Penyesuaian payload khusus untuk FDownloader.net
                if (endpoint.name === "FDownloader.net") {
                    payload.cftoken = generateCfToken();
                }

                // Kirim request dengan timeout 60 detik
                const response = await axios.post(endpoint.api_url, new URLSearchParams(payload), { headers, timeout: 60000 });
                const data = response.data;

                // PENANGANAN ERROR SPESIFIK (Penyempurnaan #1)
                if (data.mess && data.mess.toLowerCase().includes('private')) {
                    console.log(`[fbdown] Error terdeteksi: Video bersifat pribadi.`);
                    return res.status(400).json({
                        status: "Gagal",
                        sumber: endpoint.name,
                        pesan: "Video bersifat pribadi atau tidak valid."
                    });
                }

                if (data.status === 'ok' && data.data) {
                    const links = parseHtmlLinks(data.data);
                    if (links.length > 0) {
                        console.log(`[fbdown] Berhasil! Link ditemukan melalui ${endpoint.name}.`);
                        return res.status(200).json({ status: "Sukses", sumber: endpoint.name, links: links });
                    }
                }
            }
        } catch (error) {
            console.log(`[fbdown] Gagal terhubung ke ${endpoint.name}. Error: ${error.message}.`);
        }
        // Jeda antar request yang gagal
        await sleep(Math.random() * 2000 + 1000); // Jeda 1-3 detik
    }

    // Jika semua endpoint gagal
    console.log(`[fbdown] Semua endpoint gagal untuk URL: ${videoUrl}`);
    return res.status(500).json({
        status: "Gagal",
        sumber: "API_Gateway",
        pesan: "Semua endpoint gagal merespons atau tidak menemukan link unduhan."
    });
};

module.exports = { getFacebookDownloadLinks };
