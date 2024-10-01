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
  const changelogId = req.query.id;

  // Define the metadata based on the changelog ID
  let title, description, image;
  
  if (changelogId === '1') {
      title = "Changelog Update 1";
      description = "Details about the first changelog update.";
      image = "https://example.com/image1.png"; // Replace with your actual image URL
  } else if (changelogId === '2') {
      title = "Changelog Update 2";
      description = "Details about the second changelog update.";
      image = "https://example.com/image2.png"; // Replace with your actual image URL
  } else {
      title = "Jailbreak Changelogs | Latest Updates & Patch Notes";
      description = "Get updates on Jailbreak's latest features, bug fixes, and balance changes.";
      image = "https://res.cloudinary.com/dsvlphknq/image/upload/v1727536082/changelogs/changelog-image-344.png";
  }

  // Read the base changelogs.html file
  fs.readFile(path.join(__dirname, 'changelogs.html'), 'utf-8', (err, data) => {
      if (err) {
          return res.status(500).send('Internal Server Error');
      }

      // Replace the meta tags in the HTML
      const updatedData = data
          .replace(/<meta property="og:title" content=".*?" \/>/, `<meta property="og:title" content="${title}" />`)
          .replace(/<meta property="og:description" content=".*?" \/>/, `<meta property="og:description" content="${description}" />`)
          .replace(/<meta property="og:image" content=".*?" \/>/, `<meta property="og:image" content="${image}" />`)
          .replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
          .replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${description}" />`);

      // Send the modified HTML back
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
