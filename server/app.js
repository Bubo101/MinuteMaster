const express = require('express');
const app = express();
const port = 3001; // Use a different port from the React app

app.get('/', (req, res) => res.send('MinuteMaster Backend Running'));

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
