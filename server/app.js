/*
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
*/

require('dotenv').config();
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fetch = require('node-fetch'); // For making HTTP requests
const fs = require('fs');
const app = express();
const port = 3001;

app.use(cors());

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function(req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + '.' + file.originalname.split('.').pop())
  }
});

const upload = multer({ storage: storage });

app.post('/upload', upload.single('meetingAudio'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const fileName = req.file.path;
  const file = fs.readFileSync(fileName);
  const audioBytes = file.toString('base64');

  const request = {
    audio: {
      content: audioBytes,
    },
    config: {
      encoding: 'LINEAR16',
      languageCode: 'en-US',
      model: 'default',
      // useEnhanced: true, 
      diarizationConfig: {
        enableSpeakerDiarization: true
      }
    }
  };
  
  try {
    const response = await fetch(`https://speech.googleapis.com/v1/speech:recognize?key=${process.env.GOOGLE_API_KEY}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)
    });
  
    const result = await response.json();
    console.log("API Response:", JSON.stringify(result, null, 2)); // Debugging line
  
    if (!response.ok) {
        const errorDetails = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, details: ${errorDetails}`);
    }
  
    if (result.error) {
      console.error("Error from Speech-to-Text API:", result.error.message);
      res.status(500).send(`Error from API: ${result.error.message}`);
      return;
    }
  
    const transcription = result.results ? result.results.map(result => {
        const alternative = result.alternatives[0];
        return `Speaker ${result.channelTag}: ${alternative.transcript}`;
    }).join('\n') : "No transcription available.";
  
    console.log(`Transcription: ${transcription}`);
    res.send(transcription);
  } catch (err) {
    console.error('ERROR:', err);
    res.status(500). send('Failed to process audio');
  }
  
  

});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

