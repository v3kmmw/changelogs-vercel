const express = require('express');
const path = require('path');
const app = express();

// Serve your static HTML, CSS, and JS files
app.use(express.static(path.join(__dirname, '../')));

// Example API route
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from Express!' });
});

app.get('/changelogs', (req, res) => {
    res.sendFile(path.join(__dirname, '../changelogs.html'));
  });

// Handle unknown routes by serving index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

// Export the app for Vercel's serverless functions
module.exports = app;
