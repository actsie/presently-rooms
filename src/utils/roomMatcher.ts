import { UserPreferences, RoomType } from '../types';

export const matchUserToRoom = (preferences: UserPreferences): RoomType => {
  const { energyLevel, supportType } = preferences;

  if (supportType === 'silence') {
    return 'silent';
  }

  if (supportType === 'music') {
    return 'lofi';
  }

  if (supportType === 'check-ins') {
    return 'checkin';
  }

  if (energyLevel === 'low') {
    return 'silent';
  }

  if (energyLevel === 'medium') {
    return 'lofi';
  }

  return 'checkin';
};

export const getRoomDescription = (roomType: RoomType): string => {
  switch (roomType) {
    case 'silent':
      return 'A quiet space for focused work. Just you and your thoughts.';
    case 'lofi':
      return 'Gentle background music to keep you company while you work.';
    case 'checkin':
      return 'A supportive space with optional voice/video for gentle check-ins.';
    default:
      return 'Your coworking space';
  }
};

export const getRoomEmoji = (roomType: RoomType): string => {
  switch (roomType) {
    case 'silent':
      return '🤫';
    case 'lofi':
      return '🎵';
    case 'checkin':
      return '💬';
    default:
      return '🏠';
  }
};