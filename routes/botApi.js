const express = require('express');
const { getMuseumNameImage, fetchMuseumDetails } = require('../controllers/botLogic');

const router = express.Router();

router.get('/museumName/:city', getMuseumNameImage );

router.post('/museumInfo', (req, res)=>{
  console.log('Request body:', req.body);
  fetchMuseumDetails(req, res);
});                                       

exports.router = router;  