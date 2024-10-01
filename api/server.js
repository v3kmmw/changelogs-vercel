const express = require('express');
const path = require('path');
const app = express();

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Serve static files (CSS, JS)
app.use(express.static(path.join(__dirname, '../')));

app.get('/changelogs2', (req, res) => {
    res.sendFile(path.join(__dirname, '../changelogs.html'));
  });

// Route to handle changelogs with optional id query parameter
app.get('/changelogs', (req, res) => {
  const changelogId = req.query.id || 'default'; // Default to some value if no id is provided
  
  // Customize the meta data based on the changelogId
  let meta = {
    title: "Jailbreak Changelogs | Latest Updates & Patch Notes",
    description: "Get updates on Jailbreak's latest features, bug fixes, and balance changes.",
    image: "https://res.cloudinary.com/dsvlphknq/image/upload/v1727536082/changelogs/changelog-image-341.png",
    url: "https://jailbreakchangelogs.xyz/changelogs?id=" + changelogId
  };

  if (changelogId === '123') {
    meta.title = "Changelog 123 - New Features!";
    meta.description = "Details of changelog 123 for Jailbreak.";
    meta.image = "https://res.cloudinary.com/dsvlphknq/image/upload/v1727536082/changelogs/changelog-image-123.png";
  }
  
  // Render the changelogs.ejs file with dynamic meta tags
  res.render('changelogs', { meta });
});

// Handle unknown routes by serving index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

// Export the app for Vercel's serverless functions
module.exports = app;
