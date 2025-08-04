import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const BubblesContainer = styled.div`
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 1rem;
  z-index: 100;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50px;
  backdrop-filter: blur(10px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
`;

const VideoBubble = styled(motion.div)<{ $isLocal?: boolean }>`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  position: relative;
  border: 3px solid ${props => props.$isLocal ? '#667eea' : '#e2e8f0'};
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  
  &:hover .report-button {
    opacity: 1;
  }
`;

const VideoElement = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Avatar = styled.div<{ $color: string }>`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.$color};
  color: white;
  font-size: 1.5rem;
  font-weight: 600;
`;

const NameTag = styled.div`
  position: absolute;
  bottom: -25px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(45, 55, 72, 0.9);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  white-space: nowrap;
`;

const StatusIndicator = styled.div<{ $status: 'audio' | 'video' | 'both' | 'none' }>`
  position: absolute;
  bottom: 5px;
  right: 5px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: ${props => {
    switch (props.$status) {
      case 'both': return '#48bb78';
      case 'audio': return '#f6ad55';
      case 'video': return '#4299e1';
      default: return '#cbd5e0';
    }
  }};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
`;

const ReportButton = styled(motion.button)`
  position: absolute;
  top: 5px;
  right: 5px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #e53e3e;
  color: white;
  border: 2px solid white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: bold;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s;
  
  &:hover {
    background: #c53030;
    transform: scale(1.1);
  }
`;

const ReportModal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 15px;
  padding: 2rem;
  max-width: 400px;
  width: 90%;
  text-align: center;
`;

const ModalTitle = styled.h3`
  color: #e53e3e;
  margin-bottom: 1rem;
`;

const ModalText = styled.p`
  color: #4a5568;
  margin-bottom: 1.5rem;
  line-height: 1.5;
`;

const ModalButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
`;

const ModalButton = styled.button<{ $variant?: 'danger' | 'cancel' }>`
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  
  ${props => props.$variant === 'danger' ? `
    background: #e53e3e;
    color: white;
    &:hover {
      background: #c53030;
    }
  ` : `
    background: #f7fafc;
    color: #4a5568;
    border: 1px solid #e2e8f0;
    &:hover {
      background: #edf2f7;
    }
  `}
`;

interface VideoBubblesProps {
  participants: any[];
  userName?: string;
  onKickParticipant?: (participantId: string) => void;
}

const getAvatarColor = (name: string): string => {
  const colors = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
  ];
  
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
};

const getInitials = (name: string): string => {
  const parts = name.split(' ');
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

const VideoBubbles: React.FC<VideoBubblesProps> = ({ participants, userName, onKickParticipant }) => {
  const [reportingParticipant, setReportingParticipant] = useState<any>(null);
  
  if (!participants || participants.length === 0) return null;

  const validParticipants = participants.filter(p => p !== null);

  const handleReport = (participant: any) => {
    setReportingParticipant(participant);
  };

  const confirmKick = () => {
    if (reportingParticipant && onKickParticipant) {
      onKickParticipant(reportingParticipant.user_id);
    }
    setReportingParticipant(null);
  };

  const cancelReport = () => {
    setReportingParticipant(null);
  };

  return (
    <BubblesContainer>
      <AnimatePresence>
        {validParticipants.map((participant) => {
          const displayName = participant.local 
            ? (userName || 'You') 
            : (participant.user_name || 'Guest');
          
          const status = participant.video && participant.audio ? 'both' :
                        participant.video ? 'video' :
                        participant.audio ? 'audio' : 'none';

          return (
            <VideoBubble
              key={participant.user_id}
              $isLocal={participant.local}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              whileHover={{ 
                scale: 1.1, 
                y: -5
              }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {participant.video ? (
                <VideoElement 
                  autoPlay 
                  muted={participant.local}
                  playsInline
                  ref={(videoEl) => {
                    if (videoEl && participant.videoTrack) {
                      const stream = new MediaStream([participant.videoTrack]);
                      videoEl.srcObject = stream;
                    }
                  }}
                />
              ) : (
                <Avatar $color={getAvatarColor(displayName)}>
                  {getInitials(displayName)}
                </Avatar>
              )}
              
              <StatusIndicator $status={status}>
                {status === 'both' && '🎤'}
                {status === 'audio' && '🎤'}
                {status === 'video' && '📹'}
                {status === 'none' && '🔇'}
              </StatusIndicator>
              
              {/* Report button - only show for other participants with video/audio */}
              {!participant.local && (participant.video || participant.audio) && (
                <ReportButton
                  className="report-button"
                  onClick={() => handleReport(participant)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  !
                </ReportButton>
              )}
              
              <NameTag>
                {displayName}
                {participant.local && ' (you)'}
              </NameTag>
            </VideoBubble>
          );
        })}
      </AnimatePresence>
      
      {/* Report Modal */}
      <AnimatePresence>
        {reportingParticipant && (
          <ReportModal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ModalContent>
              <ModalTitle>⚠️ Report Participant</ModalTitle>
              <ModalText>
                Are you sure you want to report and remove <strong>{reportingParticipant.user_name || 'this participant'}</strong> from the room?
                <br /><br />
                This action should only be used for inappropriate behavior such as nudity, harassment, or other violations of community guidelines.
              </ModalText>
              <ModalButtons>
                <ModalButton onClick={cancelReport}>
                  Cancel
                </ModalButton>
                <ModalButton $variant="danger" onClick={confirmKick}>
                  Report & Remove
                </ModalButton>
              </ModalButtons>
            </ModalContent>
          </ReportModal>
        )}
      </AnimatePresence>
    </BubblesContainer>
  );
};

export default VideoBubbles;