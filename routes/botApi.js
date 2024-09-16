const express = require('express');
  const axios = require('axios');

const { getMuseumNameImage, fetchMuseumDetails } = require('../controllers/botLogic');

const router = express.Router();

router.get('/museumName/:city', getMuseumNameImage );

router.post('/museumInfo', (req, res)=>{
  console.log('Request body:', req.body);
  fetchMuseumDetails(req, res);
});                   


router.get('/test', async (req, res) => {

  const options = {
    method: 'GET',
    url: 'https://google-map-places.p.rapidapi.com/maps/api/place/nearbysearch/json',
    params: {
      location: '21.146633, 79.088860', // Coordinates for Nagpur
      radius: '2405665.', // 5 km radius
      type: 'museum',
      language: 'en'
    },
    headers: {
      'x-rapidapi-key': '94fe3e13cdmshbf69966db19467ap1d7caejsn0f9e693a7b76',
      'x-rapidapi-host': 'google-map-places.p.rapidapi.com'
    }
  };

  try {
    const response = await axios.request(options);
    console.log(response.data);
    
    const museums = response.data.results.map((museum) => ({
      name: museum.name,
      address: museum.vicinity,
      lat: museum.geometry.location.lat,
      business_status: museum.business_status,
      lon: museum.geometry.location.lng,
    }));
    // console.log(museums);
    res.json(museums);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

exports.router = router;  