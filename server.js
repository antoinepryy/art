const express = require('express');
const path = require('path');
const app = express();

// Serve static files from the 'dist' directory
app.use(express.static(path.join(__dirname, 'dist')));

// Handle requests for different routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.get('/mouse', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'mouse', 'index.html'));
});

app.get('/dna', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'dna', 'index.html'));
});

// Add more routes as needed

// Fallback to the main index.html for other routes (for SPA behavior)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
