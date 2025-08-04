export type EnergyLevel = 'low' | 'medium' | 'high';
export type SupportType = 'silence' | 'music' | 'check-ins';
export type RoomType = 'silent' | 'lofi' | 'checkin';

export interface UserPreferences {
  energyLevel: EnergyLevel;
  supportType: SupportType;
  displayName?: string;
  isAnonymous: boolean;
}

export interface Room {
  id: string;
  type: RoomType;
  participants: Participant[];
  dailyUrl?: string;
}

export interface Participant {
  id: string;
  name: string;
  isVideoOn: boolean;
  isAudioOn: boolean;
  avatarColor: string;
}