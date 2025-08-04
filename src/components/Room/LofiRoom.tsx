import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import BaseRoom from './BaseRoom';

const MusicPlayer = styled.div`
  width: 100%;
  max-width: 500px;
  text-align: center;
`;

const AlbumArt = styled(motion.div)`
  width: 200px;
  height: 200px;
  margin: 2rem auto;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
  box-shadow: 0 20px 40px rgba(102, 126, 234, 0.3);
`;

const TrackInfo = styled.div`
  margin: 1.5rem 0;
`;

const TrackTitle = styled.h3`
  color: #2d3748;
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
`;

const TrackArtist = styled.p`
  color: #718096;
`;

const PlayerControls = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin: 2rem 0;
`;

const ControlButton = styled(motion.button)`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #f7fafc;
  color: #4a5568;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  border: 2px solid #e2e8f0;

  &:hover {
    background: #edf2f7;
    border-color: #cbd5e0;
  }
`;

const PlayButton = styled(ControlButton)`
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  font-size: 1.5rem;

  &:hover {
    transform: scale(1.1);
  }
`;

const VolumeControl = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 1rem 0;
`;

const VolumeSlider = styled.input`
  width: 150px;
  height: 4px;
  border-radius: 2px;
  background: #e2e8f0;
  outline: none;
  -webkit-appearance: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #667eea;
    cursor: pointer;
  }

  &::-moz-range-thumb {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #667eea;
    cursor: pointer;
    border: none;
  }
`;

const SessionInfo = styled.p`
  color: #718096;
  margin: 1rem 0;
  font-size: 0.95rem;
`;

interface LofiRoomProps {
  onSwitchRoom: () => void;
}

const LofiRoom: React.FC<LofiRoomProps> = ({ onSwitchRoom }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(50);

  const tracks = [
    { title: "Rainy Day Study", artist: "Calm Vibes" },
    { title: "Coffee Shop Ambience", artist: "Focus Sounds" },
    { title: "Gentle Waves", artist: "Nature Mix" },
  ];

  const [currentTrack] = useState(0);

  return (
    <BaseRoom roomType="lofi" onSwitchRoom={onSwitchRoom}>
      <MusicPlayer>
        <AlbumArt
          animate={{ rotate: isPlaying ? 360 : 0 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          🎵
        </AlbumArt>

        <TrackInfo>
          <TrackTitle>{tracks[currentTrack].title}</TrackTitle>
          <TrackArtist>{tracks[currentTrack].artist}</TrackArtist>
        </TrackInfo>

        <PlayerControls>
          <ControlButton
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            ⏮️
          </ControlButton>
          
          <PlayButton
            onClick={() => setIsPlaying(!isPlaying)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isPlaying ? '⏸️' : '▶️'}
          </PlayButton>

          <ControlButton
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            ⏭️
          </ControlButton>
        </PlayerControls>

        <VolumeControl>
          <span>🔊</span>
          <VolumeSlider
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
          />
          <span>{volume}%</span>
        </VolumeControl>

        <SessionInfo>
          5 others are listening along with you
        </SessionInfo>
      </MusicPlayer>
    </BaseRoom>
  );
};

export default LofiRoom;