import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import BaseRoom from './BaseRoom';

const WorkSpace = styled.div`
  width: 100%;
  max-width: 600px;
  text-align: center;
`;

const Timer = styled(motion.div)`
  font-size: 4rem;
  font-weight: 300;
  color: #2d3748;
  margin: 2rem 0;
  font-variant-numeric: tabular-nums;
`;

const SessionInfo = styled.div`
  color: #718096;
  margin: 1rem 0;
`;

const BreathingGuide = styled(motion.div)`
  margin: 2rem 0;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea20 0%, #764ba220 100%);
  border-radius: 15px;
`;

const BreathText = styled.p`
  color: #4a5568;
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
`;

interface SilentRoomProps {
  onSwitchRoom: () => void;
}

const SilentRoom: React.FC<SilentRoomProps> = ({ onSwitchRoom }) => {
  const [seconds, setSeconds] = useState(0);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const breathInterval = setInterval(() => {
      setBreathPhase(phase => {
        if (phase === 'inhale') return 'hold';
        if (phase === 'hold') return 'exhale';
        return 'inhale';
      });
    }, 4000);

    return () => clearInterval(breathInterval);
  }, []);

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <BaseRoom roomType="silent" onSwitchRoom={onSwitchRoom}>
      <WorkSpace>
        <SessionInfo>Your focused work session</SessionInfo>
        <Timer
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {formatTime(seconds)}
        </Timer>
        
        <BreathingGuide
          animate={{
            scale: breathPhase === 'inhale' ? 1.05 : breathPhase === 'hold' ? 1.02 : 0.98,
          }}
          transition={{ duration: 4, ease: "easeInOut" }}
        >
          <BreathText>
            {breathPhase === 'inhale' && '🌬️ Breathe in...'}
            {breathPhase === 'hold' && '⏸️ Hold...'}
            {breathPhase === 'exhale' && '💨 Breathe out...'}
          </BreathText>
          <SessionInfo>Optional breathing guide to help you focus</SessionInfo>
        </BreathingGuide>

        <SessionInfo>
          3 others are working silently with you
        </SessionInfo>
      </WorkSpace>
    </BaseRoom>
  );
};

export default SilentRoom;