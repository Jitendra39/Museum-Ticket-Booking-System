const axios = require('axios');

const getMuseumNameImage = async (req, res) => {
const city = req.params.city || '';
console.log('City:', city);
    try {
        const coordinates = await getCityCoordinates(city);
        const museums = await fetchMuseums(coordinates.lat, coordinates.lon);
        if (museums.length === 0) {
            return res.status(404).send('No museums found');
        }
        const museum = museums[0];
        const link = await searchImages(museum.name + city);
        const result = { museums, link };
        res.send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
};

async function getCityCoordinates(city) {
    const openTripMapApiKey = '5ae2e3f221c38a28845f05b6a04d63d52bbaff23ce1750f6ee143cb8'; // Replace with your OpenTripMap API key
    const geoResponse = await fetch(`https://api.opentripmap.com/0.1/en/places/geoname?name=${city}&apikey=${openTripMapApiKey}`);
    const geoData = await geoResponse.json();
    return { lat: geoData.lat, lon: geoData.lon };
}

async function fetchMuseums(lat, lon) {
    const openTripMapApiKey = '5ae2e3f221c38a28845f05b6a04d63d52bbaff23ce1750f6ee143cb8'; // Replace with your OpenTripMap API key
    const radius = 20000; // 20 km radius
    const kinds = 'museums';
    const museumsResponse = await fetch(`https://api.opentripmap.com/0.1/en/places/radius?radius=${radius}&lon=${lon}&lat=${lat}&kinds=${kinds}&apikey=${openTripMapApiKey}`);
    const museumsData = await museumsResponse.json();
    return museumsData.features.map(museum => ({
        name: museum.properties.name,
        lat: museum.geometry.coordinates[1],
        lon: museum.geometry.coordinates[0],
    }));
}

async function searchImages(query) {
    console.log('Searching for images of', query);
    const UNSPLASH_ACCESS_KEY = 'GYRI3vP7HKIaJSeoReKCFDDDHmEBC04tfs0EYoqX1b8';
    try {
        const response = await axios.get('https://api.unsplash.com/search/photos', {
            params: {
                query: query, // Your search term, e.g., 'museum'
                per_page: 2, // Number of images to return
            },
            headers: {
                Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`
            }
        });

        const images = response.data.results;
        if (images.length > 0) {
            return images[0].urls.regular;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error fetching images:', error);
        return null;
    }
}






async function fetchMuseumDetails(req, res) {

    const {city, museums} = req.body;
    console.log('City:', city,museums);
    const geminiApiKey = 'AIzaSyA-dEa42tYpukr3c71IlT_ZvkR16YHLt5w'; // Replace with your Gemini API key
    const museumNames = museums?.map(museum => museum.name).join(', ');

    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            contents: [{ parts: [{ text: `Give detailed information about museums in ${city}, such as name, address, opening and closing hours, ticket price, description, and a trusted image link. must include ${museumNames} Strictly follow this format for each museum: **Name:**, **Address:**, **Price:**, **Opening Time:**, **Closing Time:**, **Description:**, **Image Link:**. wikimedia.org is under maintainence so dont use it. strickly must be provide a details of all museums in a ${city} city ` }] }]
        }),
    });

    const geminiData = await geminiResponse.json();
    const geminiText = geminiData.candidates[0].content.parts[0].text;


    const geminiInfo = geminiText.split('**Name:**').slice(1).map(item => {
        const details = item.split('\n').map(line => line.trim());
        return {
            name: details[0] || 'Name not available',
            address: details.find(detail => detail.startsWith('**Address:**'))?.split(':')[1]?.trim() || 'Address not available',
            price: details.find(detail => detail.startsWith('**Price:**'))?.split(':')[1]?.trim() || 'Price not available',
            openingTime: details.find(detail => detail.startsWith('**Opening Time:**'))?.split(':')[1]?.trim() || 'Opening time not available',
            closingTime: details.find(detail => detail.startsWith('**Closing Time:**'))?.split(':')[1]?.trim() || 'Closing time not available',
            description: details.find(detail => detail.startsWith('**Description:**'))?.split(':')[1]?.trim() || 'Description not available',
            imageLink: details.find(detail => detail.startsWith('**Image Link:**'))?.split(':')[1]?.trim() || 'Image not available',
        };
    });
    res.status(200).send({geminiInfo,geminiText});
}

module.exports = {
    getMuseumNameImage,
    fetchMuseumDetails
};