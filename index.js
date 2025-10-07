const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// 1. Impor rute dari modul fbdown yang sudah kita buat
const fbRoutes = require('./modules/fbdown/routes/fbRoutes');

// Halaman utama untuk memastikan server berjalan
app.get('/', (req, res) => {
    res.json({
        status: "Aktif",
        message: "Selamat Datang di Multi Downloader API!"
    });
});

// 2. Daftarkan (pasang) fbRoutes ke path /fbdown
// Ini memberitahu server: "Semua request ke /fbdown akan diurus oleh fbRoutes"
app.use('/fbdown', fbRoutes);

// Jalankan server
app.listen(PORT, () => {
    console.log(`🚀 Server utama berjalan di http://localhost:${PORT}`);
    console.log(`✅ Modul [fbdown] aktif. Siap menerima permintaan.`);
});
