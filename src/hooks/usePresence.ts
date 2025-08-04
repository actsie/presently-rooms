import { useState, useEffect, useRef } from 'react';
import { supabase } from '../utils/supabase';

type RoomType = 'silent' | 'lofi' | 'checkin';

export const usePresence = (roomType: RoomType, userName?: string) => {
  const [participantCount, setParticipantCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const userIdRef = useRef<string | undefined>(undefined);
  const channelRef = useRef<any>(null);

  useEffect(() => {
    // Generate a unique user ID for this session
    if (!userIdRef.current) {
      userIdRef.current = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    const userId = userIdRef.current;
    const channelName = `room_${roomType}`;

    // Create a channel for this room
    const channel = supabase.channel(channelName, {
      config: {
        presence: {
          key: userId
        }
      }
    });

    channelRef.current = channel;

    // Track presence changes
    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        const count = Object.keys(state).length;
        setParticipantCount(Math.max(0, count - 1)); // Subtract self
      })
      .on('presence', { event: 'join' }, ({ newPresences }) => {
        console.log('Someone joined:', newPresences);
      })
      .on('presence', { event: 'leave' }, ({ leftPresences }) => {
        console.log('Someone left:', leftPresences);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          // Send initial presence
          await channel.track({
            user_id: userId,
            user_name: userName || 'Anonymous',
            room_type: roomType,
            joined_at: new Date().toISOString()
          });
          setIsConnected(true);
        }
      });

    // Cleanup on unmount
    return () => {
      if (channelRef.current) {
        channelRef.current.unsubscribe();
      }
    };
  }, [roomType, userName]);

  return {
    participantCount,
    isConnected
  };
};