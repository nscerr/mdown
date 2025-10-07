const fs = require('fs'); // Modul untuk membaca file
const path = require('path'); // Modul untuk menangani path file

let USER_AGENTS = []; // Siapkan array kosong

try {
    // Buat path yang aman ke file UA.txt
    // __dirname adalah variabel global di Node.js yang berisi path ke folder tempat file ini berada
    const uaPath = path.join(__dirname, 'UA.txt');

    // Baca file secara sinkron, ubah menjadi string, lalu proses
    USER_AGENTS = fs.readFileSync(uaPath, 'utf8')
        .split('\n') // 1. Pecah string menjadi array berdasarkan baris baru
        .map(ua => ua.trim()) // 2. Hapus spasi kosong di awal/akhir setiap baris
        .filter(ua => ua); // 3. Hapus baris kosong jika ada

    // Jika setelah dibaca ternyata filenya kosong, gunakan fallback
    if (USER_AGENTS.length === 0) {
        throw new Error("File UA.txt kosong.");
    }

} catch (error) {
    console.error('[fbdown] Gagal membaca UA.txt, menggunakan User-Agent default:', error.message);
    // Fallback jika file tidak ada atau kosong
    USER_AGENTS = [
        "Mozilla/5.0 (iPhone; CPU iPhone OS 15_6_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.6.1 Mobile/15E148 Safari/604.1"
    ];
}

// Bagian API_ENDPOINTS tetap sama seperti sebelumnya
const API_ENDPOINTS = [
    { name: "FDownload.app", handler: 'TIPE_A', api_url: "https://fdownload.app/api/ajaxSearch", payload: { p: "home", q: "", lang: "en" } },
    { name: "FBDownloader.to", handler: 'TIPE_A', api_url: "https://fbdownloader.to/api/ajaxSearch", payload: { k_exp: "1759715048", k_token: "4e254dc86683e6d2639c0e8a83c4b5dfc83bbd18fde85f923690897bd7dd2d47", p: "home", q: "", lang: "id", v: "v2" } },
    { name: "SnapSave.io", handler: 'TIPE_A', api_url: "https://snapsave.io/api/ajaxSearch/facebook", payload: { q: "" } },
    { name: "FDownloader.net", handler: 'TIPE_A', api_url: "https://v3.fdownloader.net/api/ajaxSearch", payload: { 'k_token': '80e05c77e8e4d03b53e9fdeef08c31a4de9cd0861709a530c2299d3e8922f373', 'q': '', 'cftoken': '', 'lang': 'id', 'web': 'fdownloader.net', 'v': 'v2' } }
];

module.exports = { USER_AGENTS, API_ENDPOINTS };
