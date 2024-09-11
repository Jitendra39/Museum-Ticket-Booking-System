const express = require('express');
const { downloadPDF } = require('../controllers/ticket');
const router = express.Router();

app.get('/test',downloadPDF)

module.exports = router;