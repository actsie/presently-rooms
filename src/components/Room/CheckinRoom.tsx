import React, { useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import BaseRoom from './BaseRoom';
import { useDaily } from '../../hooks/useDaily';
import VideoBubbles from './VideoBubbles';
import Chat from './Chat';

const Container = styled.div`
  width: 100%;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const MediaControls = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const MediaButton = styled(motion.button)<{ $active?: boolean }>`
  padding: 1rem;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: ${props => props.$active 
    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
    : '#f7fafc'};
  color: ${props => props.$active ? 'white' : '#4a5568'};
  border: 2px solid ${props => props.$active ? '#667eea' : '#e2e8f0'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  position: relative;

  &:hover {
    transform: scale(1.1);
    background: ${props => props.$active 
      ? 'linear-gradient(135deg, #5a67d8 0%, #6b46a2 100%)' 
      : '#edf2f7'};
  }
`;

const Tooltip = styled(motion.div)`
  position: absolute;
  bottom: -40px;
  background: rgba(45, 55, 72, 0.9);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.85rem;
  white-space: nowrap;
  pointer-events: none;
`;

const StatusMessage = styled(motion.div)`
  background: rgba(102, 126, 234, 0.1);
  padding: 1rem 1.5rem;
  border-radius: 12px;
  color: #4a5568;
  margin: 1rem 0;
  text-align: center;
`;

const CheckInPrompt = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
  margin: 2rem 0;
  width: 100%;
`;

const PromptTitle = styled.h3`
  color: #2d3748;
  margin-bottom: 1rem;
`;

const PromptOptions = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const PromptButton = styled(motion.button)`
  padding: 1rem;
  background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  color: #4a5568;
  font-size: 0.95rem;
  text-align: left;

  &:hover {
    background: linear-gradient(135deg, #667eea20 0%, #764ba220 100%);
    border-color: #667eea;
  }
`;

const ParticipantCount = styled.p`
  color: #718096;
  text-align: center;
  margin: 1rem 0;
`;

interface CheckinRoomProps {
  onSwitchRoom: () => void;
  userName?: string;
}

const CheckinRoom: React.FC<CheckinRoomProps> = ({ onSwitchRoom, userName = 'Guest' }) => {
  const {
    participants,
    localParticipant,
    isLoading,
    error,
    joinCall,
    leaveCall,
    toggleVideo,
    toggleAudio,
    isVideoOn,
    isAudioOn,
    messages,
    sendMessage,
    kickParticipant,
  } = useDaily();

  const [showVideoTooltip, setShowVideoTooltip] = React.useState(false);
  const [showAudioTooltip, setShowAudioTooltip] = React.useState(false);

  useEffect(() => {
    const roomUrl = process.env.REACT_APP_DAILY_ROOM_URL || 'https://your-domain.daily.co/presently-room';
    joinCall(roomUrl, userName);

    return () => {
      leaveCall();
    };
  }, []);

  const checkInPrompts = [
    "🌟 Share a win from today",
    "💭 What's on your mind?",
    "🎯 Today's focus is...",
    "🙏 Grateful for...",
    "💪 I need support with...",
    "🎨 Working on..."
  ];

  const HeaderControls = (
    <MediaControls>
      <MediaButton
        $active={isVideoOn}
        onClick={toggleVideo}
        onHoverStart={() => setShowVideoTooltip(true)}
        onHoverEnd={() => setShowVideoTooltip(false)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {isVideoOn ? '📹' : '📷'}
        <AnimatePresence>
          {showVideoTooltip && (
            <Tooltip
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
            >
              {isVideoOn ? 'Camera is on (click to turn off)' : 'Turn on camera (optional)'}
            </Tooltip>
          )}
        </AnimatePresence>
      </MediaButton>

      <MediaButton
        $active={isAudioOn}
        onClick={toggleAudio}
        onHoverStart={() => setShowAudioTooltip(true)}
        onHoverEnd={() => setShowAudioTooltip(false)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {isAudioOn ? '🎤' : '🔇'}
        <AnimatePresence>
          {showAudioTooltip && (
            <Tooltip
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
            >
              {isAudioOn ? 'Mic is on (click to mute)' : 'Turn on mic (optional)'}
            </Tooltip>
          )}
        </AnimatePresence>
      </MediaButton>
    </MediaControls>
  );

  return (
    <>
      <VideoBubbles 
        participants={[...participants, localParticipant].filter(Boolean)} 
        userName={userName}
        onKickParticipant={kickParticipant}
      />
      
      <BaseRoom 
        roomType="checkin" 
        onSwitchRoom={onSwitchRoom}
        headerContent={HeaderControls}
      >
        <Container>
          {error && (
            <StatusMessage
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {error}
            </StatusMessage>
          )}

          {isLoading && (
            <StatusMessage
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              Setting up your calm space...
            </StatusMessage>
          )}

          <CheckInPrompt>
            <PromptTitle>Today's gentle check-in prompts</PromptTitle>
            <PromptOptions>
              {checkInPrompts.map((prompt, index) => (
                <PromptButton
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {prompt}
                </PromptButton>
              ))}
            </PromptOptions>
          </CheckInPrompt>

          <ParticipantCount>
            {participants.length > 0 
              ? `${participants.length + 1} gentle souls in this room`
              : 'You have this space to yourself right now'}
          </ParticipantCount>

          <StatusMessage
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ background: 'rgba(237, 242, 247, 0.5)' }}
          >
            {!isVideoOn && !isAudioOn && "Camera and mic are off. Join when you're ready - no pressure 💜"}
            {isVideoOn && !isAudioOn && "Camera is on, mic is off. Wave hello! 👋"}
            {!isVideoOn && isAudioOn && "Mic is on, camera is off. Your voice is welcome here 🎤"}
            {isVideoOn && isAudioOn && "Fully connected. Thanks for sharing your presence 🌟"}
          </StatusMessage>
        </Container>
      </BaseRoom>
      
      <Chat 
        messages={messages}
        sendMessage={sendMessage}
        participants={participants}
        localParticipant={localParticipant}
      />
    </>
  );
};

export default CheckinRoom;