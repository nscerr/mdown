const express = require('express');
const router = express.Router();
const { getFacebookDownloadLinks } = require('../controllers/fbController');

// Menghubungkan path GET / ke fungsi controller
router.get('/', getFacebookDownloadLinks);

module.exports = router;
