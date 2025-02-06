const express = require('express');
const app = express();
// ...existing code...

// Route to clear cache
app.get('/clear-cache', (req, res) => {
    // Assuming you are using a caching middleware like apicache
    apicache.clear();
    res.send('Cache cleared');
});

// ...existing code...
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
