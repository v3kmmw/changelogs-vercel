const express = require('express');
const path = require('path');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 5500; // Set the port
const fs = require('fs');
// Serve your static HTML, CSS, and JS files
app.use(express.static(path.join(__dirname, '../')));
console.log('Views directory:', path.join(__dirname, '../views'));
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
console.log(path.join(__dirname, '../views'));

app.get('/changelogs', async (req, res) => {
  const changelogId = req.query.id;

  try {
      // Fetch the changelog data from the API
      const response = await axios.get(`https://api.jailbreakchangelogs.xyz/changelogs/get?id=${changelogId}`,);

      // Extract only the title and image_url from the response data
      const { title, image_url } = response.data; // Adjust the image_url based on your API response structure

      // Render the EJS template and pass the metadata
      res.render('changelogs', { title, image_url });
  } catch (error) {
      console.error("Error fetching changelog data:", error);
      res.status(500).send('Internal Server Error');
  }
});
app.get('/hello', (req, res) => {
    res.send('Hello, World!')});

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
