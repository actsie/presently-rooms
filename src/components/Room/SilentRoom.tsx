import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import BaseRoom from './BaseRoom';
import { usePresence } from '../../hooks/usePresence';
import FocusSession from './FocusSession';

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

const StartSessionButton = styled(motion.button)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin: 2rem 0;

  &:hover {
    transform: translateY(-2px);
  }
`;

const ProgressStats = styled.div`
  background: linear-gradient(135deg, #667eea10 0%, #764ba210 100%);
  padding: 1.5rem;
  border-radius: 12px;
  margin: 2rem 0;
`;

const StatItem = styled.div`
  color: #4a5568;
  margin: 0.5rem 0;
`;

interface SilentRoomProps {
  onSwitchRoom: () => void;
  userName?: string;
}

const SilentRoom: React.FC<SilentRoomProps> = ({ onSwitchRoom, userName }) => {
  const [seconds, setSeconds] = useState(0);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [showFocusSession, setShowFocusSession] = useState(false);
  const [todayStats, setTodayStats] = useState({ sessionsStarted: 0, actualMinutes: 0 });
  const { participantCount, isConnected } = usePresence('silent', userName);

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

  // Load today's stats from localStorage
  useEffect(() => {
    const today = new Date().toDateString();
    const saved = localStorage.getItem(`focus-stats-${today}`);
    if (saved) {
      setTodayStats(JSON.parse(saved));
    }
  }, []);

  const handleSessionComplete = (actualMinutesSpent: number, sessionStarted: boolean = false) => {
    const today = new Date().toDateString();
    const newStats = {
      sessionsStarted: todayStats.sessionsStarted + (sessionStarted ? 1 : 0),
      actualMinutes: todayStats.actualMinutes + actualMinutesSpent
    };
    setTodayStats(newStats);
    localStorage.setItem(`focus-stats-${today}`, JSON.stringify(newStats));
  };

  const handleSessionStart = () => {
    handleSessionComplete(0, true); // Count that a session was started
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  if (showFocusSession) {
    return (
      <BaseRoom roomType="silent" onSwitchRoom={onSwitchRoom}>
        <WorkSpace>
          <FocusSession
            onSessionComplete={handleSessionComplete}
            onSessionStart={handleSessionStart}
            onReturn={() => setShowFocusSession(false)}
          />
        </WorkSpace>
      </BaseRoom>
    );
  }

  return (
    <BaseRoom roomType="silent" onSwitchRoom={onSwitchRoom}>
      <WorkSpace>
        <SessionInfo>Your quiet workspace</SessionInfo>
        
        <StartSessionButton
          onClick={() => setShowFocusSession(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Start Focus Session
        </StartSessionButton>

        {(todayStats.sessionsStarted > 0 || todayStats.actualMinutes > 0) && (
          <ProgressStats>
            {todayStats.sessionsStarted > 0 && (
              <StatItem>
                <strong>Today:</strong> {todayStats.sessionsStarted} focus session{todayStats.sessionsStarted !== 1 ? 's' : ''} started
              </StatItem>
            )}
            {todayStats.actualMinutes > 0 && (
              <StatItem>
                <strong>Actual focus time:</strong> {formatDuration(todayStats.actualMinutes)}
              </StatItem>
            )}
            <StatItem style={{ fontSize: '0.9rem', opacity: 0.8, marginTop: '0.5rem' }}>
              Every minute of focus counts 💜
            </StatItem>
          </ProgressStats>
        )}
        
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
            {breathPhase === 'inhale' && 'Breathe in...'}
            {breathPhase === 'hold' && 'Hold...'}
            {breathPhase === 'exhale' && 'Breathe out...'}
          </BreathText>
          <SessionInfo>Optional breathing guide to help you focus</SessionInfo>
        </BreathingGuide>

        <SessionInfo
          as={motion.div}
          key={participantCount}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {!isConnected 
            ? 'Connecting...' 
            : participantCount === 0 
              ? 'You have this space to yourself'
              : `${participantCount} ${participantCount === 1 ? 'other is' : 'others are'} working silently with you`
          }
        </SessionInfo>
      </WorkSpace>
    </BaseRoom>
  );
};

export default SilentRoom;