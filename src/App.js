import './App.css';
import Player from './components/Player';
import audioSrc from './media/Monologue.mp3';
import transcript from './media/Monolouge_transcript.json';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Player audioSrc={audioSrc} transcript={transcript} />
      </header>
    </div>
  );
}

export default App;
