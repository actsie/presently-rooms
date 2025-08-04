import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { RoomType } from '../../types';
import { getRoomDescription, getRoomEmoji } from '../../utils/roomMatcher';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 2rem;
`;

const Header = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
`;

const RoomInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
`;

const RoomTitle = styled.h2`
  color: #2d3748;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.5rem;
`;

const RoomDescription = styled.p`
  color: #718096;
  margin-top: 0.5rem;
`;

const Controls = styled.div`
  display: flex;
  gap: 1rem;
`;

const Button = styled(motion.button)`
  padding: 0.75rem 1.5rem;
  background: #f7fafc;
  color: #4a5568;
  border-radius: 12px;
  font-size: 0.95rem;
  border: 2px solid #e2e8f0;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background: #edf2f7;
    border-color: #cbd5e0;
  }
`;

const MainContent = styled.div`
  flex: 1;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const MicroCopy = styled.p`
  color: #718096;
  font-size: 0.9rem;
  text-align: center;
  font-style: italic;
  margin: 1rem 0;
`;

interface BaseRoomProps {
  roomType: RoomType;
  onSwitchRoom: () => void;
  children?: React.ReactNode;
  headerContent?: React.ReactNode;
}

const BaseRoom: React.FC<BaseRoomProps> = ({ 
  roomType, 
  onSwitchRoom, 
  children,
  headerContent 
}) => {
  return (
    <Container>
      <Header>
        <RoomInfo>
          <div>
            <RoomTitle>
              <span>{getRoomEmoji(roomType)}</span>
              {roomType === 'silent' && 'Silent Room'}
              {roomType === 'lofi' && 'Lo-fi Room'}
              {roomType === 'checkin' && 'Check-in Room'}
            </RoomTitle>
            <RoomDescription>{getRoomDescription(roomType)}</RoomDescription>
          </div>
          <Controls>
            {headerContent}
            <Button
              onClick={onSwitchRoom}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Switch Room
            </Button>
          </Controls>
        </RoomInfo>
      </Header>

      <MainContent>
        {children}
        <MicroCopy>
          {roomType === 'silent' && "You're doing great. Take your time."}
          {roomType === 'lofi' && "Let the music carry you through your work."}
          {roomType === 'checkin' && "You're not alone. Share when you're ready."}
        </MicroCopy>
      </MainContent>
    </Container>
  );
};

export default BaseRoom;