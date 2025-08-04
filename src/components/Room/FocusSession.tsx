import React, { useState, useEffect, useCallback, useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { createSparkles, playChime } from '../../utils/party';

const SessionContainer = styled.div`
  width: 100%;
  max-width: 600px;
  text-align: center;
`;

const SessionSelector = styled.div`
  margin: 2rem 0;
`;

const SelectorTitle = styled.h3`
  color: #2d3748;
  margin-bottom: 1.5rem;
  font-weight: 500;
`;

const DurationGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const DurationButton = styled(motion.button)<{ $selected?: boolean }>`
  padding: 1rem;
  border-radius: 12px;
  border: 2px solid ${props => props.$selected ? '#667eea' : '#e2e8f0'};
  background: ${props => props.$selected ? '#667eea' : 'white'};
  color: ${props => props.$selected ? 'white' : '#4a5568'};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #667eea;
    transform: translateY(-2px);
  }
`;

const CustomDuration = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin: 1rem 0;
`;

const CustomInput = styled.input`
  width: 80px;
  padding: 0.5rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  text-align: center;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const StartButton = styled(motion.button)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1rem;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const BackButton = styled(motion.button)`
  background: #f7fafc;
  color: #4a5568;
  border: 1px solid #e2e8f0;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 2rem;

  &:hover {
    background: #edf2f7;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  align-items: center;
  margin-top: 1rem;
`;

const TimerDisplay = styled(motion.div)`
  font-size: 5rem;
  font-weight: 300;
  color: #2d3748;
  margin: 3rem 0;
  font-variant-numeric: tabular-nums;
`;

const SparkleText = styled(motion.div)`
  font-size: 5rem;
  font-weight: 300;
  color: #48bb78;
  margin: 3rem 0;
  cursor: pointer;
  user-select: none;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: scale(1.05);
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const TimerControls = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin: 2rem 0;
`;

const ControlButton = styled(motion.button)<{ $variant?: 'primary' | 'danger' }>`
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  
  ${props => props.$variant === 'danger' ? `
    background: #e53e3e;
    color: white;
    &:hover { background: #c53030; }
  ` : props.$variant === 'primary' ? `
    background: #667eea;
    color: white;
    &:hover { background: #5a67d8; }
  ` : `
    background: #f7fafc;
    color: #4a5568;
    border: 1px solid #e2e8f0;
    &:hover { background: #edf2f7; }
  `}
`;

const SessionStatus = styled.p`
  color: #718096;
  margin: 1rem 0;
`;

const BreakContainer = styled(motion.div)`
  background: linear-gradient(135deg, #667eea20 0%, #764ba220 100%);
  padding: 2rem;
  border-radius: 15px;
  margin: 2rem 0;
`;

const BreakTitle = styled.h3`
  color: #2d3748;
  margin-bottom: 1rem;
`;

const BreakButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1.5rem;
`;

interface FocusSessionProps {
  onSessionComplete: (actualMinutesSpent: number) => void;
  onSessionStart: () => void;
  onReturn: () => void;
}

type SessionState = 'selecting' | 'active' | 'paused' | 'break' | 'completed';

const PRESET_DURATIONS = [
  { label: '15 min', value: 15, category: 'Quick Focus' },
  { label: '25 min', value: 25, category: 'Pomodoro' },
  { label: '30 min', value: 30, category: 'Quick Focus' },
  { label: '45 min', value: 45, category: 'Deep Work' },
  { label: '60 min', value: 60, category: 'Deep Work' },
  { label: '90 min', value: 90, category: 'Deep Work' },
];

const FocusSession: React.FC<FocusSessionProps> = ({ onSessionComplete, onSessionStart, onReturn }) => {
  const [state, setState] = useState<SessionState>('selecting');
  const [selectedDuration, setSelectedDuration] = useState(25);
  const [customDuration, setCustomDuration] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [actualTimeSpent, setActualTimeSpent] = useState(0); // Track actual focus time in seconds
  const [isPaused, setIsPaused] = useState(false);
  const [pausesUsed, setPausesUsed] = useState(0);
  const [pauseStartTime, setPauseStartTime] = useState<number | null>(null);
  const [breakTimeRemaining, setBreakTimeRemaining] = useState(0);
  const sparkleTextRef = useRef<HTMLDivElement>(null);

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const startSession = () => {
    const duration = customDuration ? parseInt(customDuration) : selectedDuration;
    if (duration > 0) {
      setTimeRemaining(duration * 60);
      setActualTimeSpent(0); // Reset actual time tracking
      setState('active');
      setIsPaused(false);
      setPausesUsed(0);
      onSessionStart(); // Track that a session was started
    }
  };

  const pauseSession = () => {
    if (pausesUsed < 1) {
      setIsPaused(true);
      setPauseStartTime(Date.now());
      setState('paused');
    }
  };

  const resumeSession = () => {
    setIsPaused(false);
    setPauseStartTime(null);
    setState('active');
  };

  const endSession = () => {
    setState('completed');
    const actualMinutes = Math.round(actualTimeSpent / 60); // Convert seconds to minutes
    onSessionComplete(actualMinutes);
  };

  const startBreak = () => {
    setBreakTimeRemaining(5 * 60); // 5 minutes
    setState('break');
  };

  const skipBreak = () => {
    setState('selecting');
    setSelectedDuration(25);
    setCustomDuration('');
  };

  const extendBreak = () => {
    setBreakTimeRemaining(prev => prev + 5 * 60); // Add 5 more minutes
  };

  const endBreak = () => {
    setState('selecting');
    setSelectedDuration(25);
    setCustomDuration('');
  };

  const handleSparkleClick = () => {
    if (sparkleTextRef.current) {
      createSparkles(sparkleTextRef.current, { count: 30 });
      playChime();
    }
  };

  // Auto-trigger sparkles when session completes
  useEffect(() => {
    if (state === 'completed' && sparkleTextRef.current) {
      const timer = setTimeout(() => {
        createSparkles(sparkleTextRef.current!, { count: 25 });
        playChime();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [state]);

  // Main session timer
  useEffect(() => {
    if (state === 'active' && !isPaused && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setState('completed');
            return 0;
          }
          return prev - 1;
        });
        // Track actual focus time (only when active and not paused)
        setActualTimeSpent(prev => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [state, isPaused, timeRemaining]);

  // Break timer
  useEffect(() => {
    if (state === 'break' && breakTimeRemaining > 0) {
      const timer = setInterval(() => {
        setBreakTimeRemaining(prev => {
          if (prev <= 1) {
            setState('selecting');
            setSelectedDuration(25);
            setCustomDuration('');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [state, breakTimeRemaining]);

  // Pause timeout (10 minutes max)
  useEffect(() => {
    if (state === 'paused' && pauseStartTime) {
      const timeout = setTimeout(() => {
        // Auto-resume after 10 minutes
        resumeSession();
      }, 10 * 60 * 1000);
      return () => clearTimeout(timeout);
    }
  }, [state, pauseStartTime]);

  return (
    <SessionContainer>
      <AnimatePresence mode="wait">
        {state === 'selecting' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <BackButton
              onClick={onReturn}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              ← Back to Silent Room
            </BackButton>
            
            <SessionSelector>
              <SelectorTitle>Choose your focus session</SelectorTitle>
              
              <DurationGrid>
                {PRESET_DURATIONS.map((duration) => (
                  <DurationButton
                    key={duration.value}
                    $selected={selectedDuration === duration.value && !customDuration}
                    onClick={() => {
                      setSelectedDuration(duration.value);
                      setCustomDuration('');
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div>{duration.label}</div>
                    <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>
                      {duration.category}
                    </div>
                  </DurationButton>
                ))}
              </DurationGrid>

              <CustomDuration>
                <span>Custom:</span>
                <CustomInput
                  type="number"
                  min="1"
                  max="180"
                  placeholder="30"
                  value={customDuration}
                  onChange={(e) => setCustomDuration(e.target.value)}
                />
                <span>minutes</span>
              </CustomDuration>

              <ButtonGroup>
                <StartButton
                  onClick={startSession}
                  disabled={!selectedDuration && !customDuration}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Start Focus Session
                </StartButton>
              </ButtonGroup>
            </SessionSelector>
          </motion.div>
        )}

        {(state === 'active' || state === 'paused') && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <TimerDisplay>{formatTime(timeRemaining)}</TimerDisplay>
            
            <SessionStatus>
              {state === 'paused' 
                ? 'Session paused - resume when ready' 
                : 'Focus session in progress'}
            </SessionStatus>

            <TimerControls>
              {state === 'paused' ? (
                <ControlButton $variant="primary" onClick={resumeSession}>
                  Resume
                </ControlButton>
              ) : (
                <ControlButton 
                  onClick={pauseSession}
                  disabled={pausesUsed >= 1}
                >
                  {pausesUsed >= 1 ? 'Pause Used' : 'Pause'}
                </ControlButton>
              )}
              
              <ControlButton $variant="danger" onClick={endSession}>
                End Session
              </ControlButton>
            </TimerControls>

            {state === 'paused' && (
              <SessionStatus style={{ color: '#718096', fontSize: '0.9rem' }}>
                Paused sessions auto-resume after 10 minutes
              </SessionStatus>
            )}
          </motion.div>
        )}

        {state === 'completed' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <SparkleText 
              ref={sparkleTextRef}
              onClick={handleSparkleClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Session Complete!
            </SparkleText>
            
            <SessionStatus>
              Great work! You focused for {Math.round(actualTimeSpent / 60)} minutes.
            </SessionStatus>

            <TimerControls>
              <ControlButton $variant="primary" onClick={startBreak}>
                Take 5-min Break
              </ControlButton>
              <ControlButton onClick={skipBreak}>
                Skip Break
              </ControlButton>
              <ControlButton onClick={onReturn}>
                Return to Room
              </ControlButton>
            </TimerControls>
          </motion.div>
        )}

        {state === 'break' && (
          <BreakContainer
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <BreakTitle>Break Time</BreakTitle>
            <TimerDisplay style={{ fontSize: '3rem' }}>
              {formatTime(breakTimeRemaining)}
            </TimerDisplay>
            <SessionStatus>
              Take a breath, step away from screen
            </SessionStatus>
            
            <BreakButtons>
              <ControlButton onClick={endBreak}>
                End Break Early
              </ControlButton>
              <ControlButton onClick={extendBreak}>
                +5 More Minutes
              </ControlButton>
            </BreakButtons>
          </BreakContainer>
        )}
      </AnimatePresence>
    </SessionContainer>
  );
};

export default FocusSession;