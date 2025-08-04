import { useEffect, useState, useCallback, useRef } from 'react';
import DailyIframe, { DailyCall } from '@daily-co/daily-js';

export interface DailyParticipant {
  user_id: string;
  user_name: string;
  video: boolean;
  audio: boolean;
  screen: boolean;
  local: boolean;
}

interface UseDailyReturn {
  callObject: DailyCall | null;
  participants: DailyParticipant[];
  localParticipant: DailyParticipant | null;
  isLoading: boolean;
  error: string | null;
  joinCall: (url: string) => Promise<void>;
  leaveCall: () => void;
  toggleVideo: () => void;
  toggleAudio: () => void;
  isVideoOn: boolean;
  isAudioOn: boolean;
}

export const useDaily = (): UseDailyReturn => {
  const [callObject, setCallObject] = useState<DailyCall | null>(null);
  const isJoiningRef = useRef(false);
  const [participants, setParticipants] = useState<DailyParticipant[]>([]);
  const [localParticipant, setLocalParticipant] = useState<DailyParticipant | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isAudioOn, setIsAudioOn] = useState(false);

  const handleParticipantUpdate = useCallback((event: any) => {
    console.log('handleParticipantUpdate called with event:', event);
    if (!callObject) {
      console.log('No callObject, returning');
      return;
    }
    
    const participants = callObject.participants();
    const participantList = Object.values(participants);
    
    console.log('All participants:', participantList);
    console.log('Looking for local participant...');
    
    setParticipants(participantList.filter(p => !p.local));
    
    const local = participantList.find(p => p.local);
    console.log('Found local participant:', local);
    
    if (local) {
      setLocalParticipant(local);
      setIsVideoOn(local.video);
      setIsAudioOn(local.audio);
    } else {
      // Fallback: use callObject methods to get local state
      const localVideo = callObject.localVideo();
      const localAudio = callObject.localAudio();
      console.log('Fallback - local video:', localVideo, 'local audio:', localAudio);
      setIsVideoOn(localVideo);
      setIsAudioOn(localAudio);
    }
  }, [callObject]);

  const joinCall = useCallback(async (url: string) => {
    if (isJoiningRef.current) {
      console.log('Join in progress, skipping join');
      return;
    }
    
    // Clean up existing call object if any
    if (callObject) {
      console.log('Cleaning up existing call object');
      callObject.destroy();
      setCallObject(null);
    }
    
    isJoiningRef.current = true;
    setIsLoading(true);
    setError(null);
    
    try {
      const newCallObject = DailyIframe.createCallObject({
        showLeaveButton: false,
        showFullscreenButton: false,
      });

      await newCallObject.join({ 
        url,
        userName: 'Guest',
        startVideoOff: true,
        startAudioOff: true
      });

      setCallObject(newCallObject);

      const updateHandler = (event: any) => {
        console.log('Event handler called with:', event);
        const participants = newCallObject.participants();
        const participantList = Object.values(participants);
        
        console.log('All participants:', participantList);
        
        setParticipants(participantList.filter(p => !p.local));
        
        const local = participantList.find(p => p.local);
        console.log('Found local participant:', local);
        
        if (local) {
          setLocalParticipant(local);
          setIsVideoOn(local.video);
          setIsAudioOn(local.audio);
        } else {
          const localVideo = newCallObject.localVideo();
          const localAudio = newCallObject.localAudio();
          console.log('Fallback - local video:', localVideo, 'local audio:', localAudio);
          setIsVideoOn(localVideo);
          setIsAudioOn(localAudio);
        }
      };

      newCallObject.on('participant-joined', updateHandler);
      newCallObject.on('participant-left', updateHandler);
      newCallObject.on('participant-updated', updateHandler);

      updateHandler(null);
    } catch (err) {
      setError('Failed to join room. Please try again.');
      console.error('Daily join error:', err);
    } finally {
      setIsLoading(false);
      isJoiningRef.current = false;
    }
  }, [handleParticipantUpdate]);

  const leaveCall = useCallback(() => {
    if (callObject) {
      callObject.leave();
      callObject.destroy();
      setCallObject(null);
      setParticipants([]);
      setLocalParticipant(null);
      setIsVideoOn(false);
      setIsAudioOn(false);
    }
  }, [callObject]);

  const toggleVideo = useCallback(() => {
    if (callObject) {
      callObject.setLocalVideo(!isVideoOn);
      setIsVideoOn(!isVideoOn);
    }
  }, [callObject, isVideoOn]);

  const toggleAudio = useCallback(() => {
    if (callObject) {
      callObject.setLocalAudio(!isAudioOn);
      setIsAudioOn(!isAudioOn);
    }
  }, [callObject, isAudioOn]);

  useEffect(() => {
    return () => {
      if (callObject) {
        callObject.leave();
        callObject.destroy();
      }
    };
  }, [callObject]);

  return {
    callObject,
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
  };
};