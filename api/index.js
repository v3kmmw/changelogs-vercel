const express = require('express');
const path = require('path');
const cors = require('cors');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 5500; // Set the port
const fs = require('fs');
// Serve your static HTML, CSS, and JS files
app.use(express.static(path.join(__dirname, '../')));
app.use(cors({
  origin: 'https://vercel.jailbreakchangelogs.xyz'
}));
// Serve the changelogs.html file
app.get('/changelogs2', (req, res) => {
  const filePath = path.join(__dirname, '../changelogs.html');
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error('Error sending file:', err);
      res.status(err.status).end();
    } else {
      console.log('File sent successfully');
    }
  });
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Set the directory for your EJS files

app.get('/changelogs', async (req, res) => {
  const changelogId = req.query.id;
  const apiUrl = `https://api.jailbreakchangelogs.xyz/changelogs/get?id=${changelogId}`;

  try {
    const response = await fetch(apiUrl,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Origin': 'https://vercel.jailbreakchangelogs.xyz'
        },
      }
    ); 
    if (response.status === 404) {
      res.render('changelogs', { title: 'Changelog not found', image_url: 'https://res.cloudinary.com/dsvlphknq/image/upload/v1727054787/changelogs/changelog-image-287.png' }); 
    }

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    const { title, image_url } = data;

    res.render('changelogs', { title, image_url });

  } catch (error) {
    console.error("Error fetching changelog data:", error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/seasons', async (req, res) => {
  const seasonId = req.query.id; // Get the season ID from the query parameter
  const apiUrl = `https://api.jailbreakchangelogs.xyz/seasons/get?season=${seasonId}`; // Adjust this URL based on your API

  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://vercel.jailbreakchangelogs.xyz',
      },
    }); 
    if (!response.status === 404) {
      res.render('seasons', { season: '???', title: 'Season not found' }); 
    }

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    
    const { season, title } = data; // Adjust the destructured properties based on the API response structure
    res.render('seasons', { season, title }); // Render the seasons page with the retrieved data

  } catch (error) {
    console.error("Error fetching season data:", error);
    res.status(500).send('Internal Server Error');
  }
});

// Handle unknown routes by serving index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

// Export the app for Vercel's serverless functions
module.exports = app;
