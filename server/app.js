const express = require('express');
const multer = require('multer');
const cors = require('cors'); // Include CORS
const app = express();
const port = 3001;

app.use(cors());

// Set up storage engine
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/') // Make sure this uploads directory exists
  },
  filename: function(req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + '.' + file.originalname.split('.').pop())
  }
});

const upload = multer({ storage: storage });

// Upload endpoint
app.post('/upload', upload.single('meetingAudio'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  // Placeholder for processing
  res.send('File uploaded successfully.');
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
