import React from 'react';
import AudioUpload from './AudioUpload';
import AudioRecorder from './AudioRecorder';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>MinuteMaster Upload</h1>
        <AudioRecorder />
        <AudioUpload />
      </header>
    </div>
  );
}

export default App;
