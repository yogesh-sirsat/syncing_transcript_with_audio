import React, { useRef, useState, useEffect } from 'react';
import './Player.css';

const AudioPlayer = ({ audioSrc, transcript }) => {
  const playerRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [activeWordIndex, setActiveWordIndex] = useState(0);

  useEffect(() => {
    const player = playerRef.current;
    const onTimeUpdate = () => {
      setCurrentTime(player.currentTime);
      setActiveWordIndex(getActiveWordIndex(player.currentTime, transcript.results.items));
    };
    player.addEventListener('timeupdate', onTimeUpdate);
    return () => player.removeEventListener('timeupdate', onTimeUpdate);
  }, [transcript, playerRef]);

  const handleBackward = () => {
    playerRef.current.currentTime -= 10;
    setCurrentTime(playerRef.current.currentTime);
    setActiveWordIndex(getActiveWordIndex(playerRef.current.currentTime, transcript.results.items));
  };

  const handleForward = () => {
    playerRef.current.currentTime += 10;
    setCurrentTime(playerRef.current.currentTime);
    setActiveWordIndex(getActiveWordIndex(playerRef.current.currentTime, transcript.results.items));
  };

  const handleTimeUpdate = () => {
    setCurrentTime(playerRef.current.currentTime);
  };

  const getActiveWordIndex = (currentTime, words) => {
    return words.findIndex((word, index) => {
      if (index < words.length - 1) {
        return word.start_time <= currentTime && word.end_time > currentTime;
      } else {
        return word.start_time <= currentTime;
      }
    });
  };

  const renderTranscript = () => {
    return transcript.results.items.map((word, index) => {
      const isActive = index === activeWordIndex;
      const isFuture = word.start_time > currentTime;
      const isPast = word.end_time < currentTime;
      const className = isActive ? 'active-word' : isFuture ? 'future-word' : isPast ? 'past-word' : '';
      const isNextPunctuation = transcript.results.items[index + 1] && transcript.results.items[index + 1].type === 'punctuation';

      return (
        <span key={index} className={`transcript-word ${className}`}>
          {word.alternatives[0].content}{isNextPunctuation ? '' : ' '}
        </span>
      );
    });
  };

  return (
    <>
      <div className="transcript">{renderTranscript()}</div>
      <div>
        <h2>Audio Player</h2>
        <audio controls src={audioSrc} ref={playerRef} onTimeUpdate={handleTimeUpdate} />
      </div>
      <div className="audio-controls">
        <button onClick={handleBackward}>Backward 10s</button>
        <button onClick={handleForward}>Forward 10s</button>
      </div>
    </>
  );
};

export default AudioPlayer;
