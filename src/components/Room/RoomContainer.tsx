import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { UserPreferences } from '../../types';
import { matchUserToRoom } from '../../utils/roomMatcher';
import SilentRoom from './SilentRoom';
import LofiRoom from './LofiRoom';
import CheckinRoom from './CheckinRoom';

const RoomContainer: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { preferences } = location.state as { preferences: UserPreferences };
  
  const [currentRoomType, setCurrentRoomType] = useState(
    matchUserToRoom(preferences)
  );

  const handleSwitchRoom = () => {
    navigate('/');
  };

  switch (currentRoomType) {
    case 'silent':
      return <SilentRoom onSwitchRoom={handleSwitchRoom} />;
    case 'lofi':
      return <LofiRoom onSwitchRoom={handleSwitchRoom} />;
    case 'checkin':
      return <CheckinRoom 
        onSwitchRoom={handleSwitchRoom} 
        userName={preferences.displayName}
      />;
    default:
      return <SilentRoom onSwitchRoom={handleSwitchRoom} />;
  }
};

export default RoomContainer;