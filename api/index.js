const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000; // Set the port
const fs = require('fs');
// Serve your static HTML, CSS, and JS files
app.use(express.static(path.join(__dirname, '../')));

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

app.get('/changelogs', (req, res) => {
  const changelogId = req.query.id; // Get the changelog ID from the query parameter
  
  // Path to your changelogs.html file
  const filePath = path.join(__dirname, '../changelogs.html');
  
  // Read the changelogs.html file
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Error reading the file.');
    }
    
    // Dynamically update the meta tags based on the changelog ID
    let updatedData = data;
    
    if (changelogId) {
      // Example: Change Open Graph meta tags based on changelog ID
      const newTitle = `Changelog Update #${changelogId}`;
      const newDescription = `Details about changelog #${changelogId}.`;
      const newImage = `https://your-image-url.com/changelog-${changelogId}.png`;

      updatedData = updatedData
        .replace(/<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${newTitle}" />`)
        .replace(/<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${newDescription}" />`)
        .replace(/<meta property="og:image" content="[^"]*" \/>/, `<meta property="og:image" content="${newImage}" />`);
    }

    // Send the modified HTML as the response
    res.send(updatedData);
  });
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
