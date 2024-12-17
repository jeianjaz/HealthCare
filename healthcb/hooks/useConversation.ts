import { 
  Client,
  State,
  Conversation,
  Message,
  Participant,
  User,
  Media,
  Paginator,
} from '@twilio/conversations';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { getCsrfToken } from '@/utils/csrf';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const useConversations = ({ 
  identity = '', 
  userType = 'patient',
  roomSid = ''
}: { 
  identity: string; 
  userType: 'patient' | 'admin';
  roomSid?: string;
}) => {
  const [client, setClient] = useState<Client | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  
  const tryGetConversation = async (client: Client, sid: string, retries = 3): Promise<Conversation | null> => {
    for (let i = 0; i < retries; i++) {
      try {
        await delay(Math.pow(2, i) * 1000);
        const conversation = await client.getConversationByUniqueName(sid);
        const participants = await conversation.getParticipants();

        if (!participants.some(p => p.identity === client.user.identity)) {
          await conversation.join();
        }
        return conversation;
      } catch {
        try {
          const conversation = await client.getConversationBySid(sid);
          const participants = await conversation.getParticipants();
          if (!participants.some(p => p.identity === client.user.identity)) {
            await conversation.join();
          }
          return conversation;
        } catch {
          if (i === retries - 1) return null;
        }
      }
    }
    return null;
  };
  
  const tryCreateConversation = async (client: Client, sid: string, participants: string[], retries = 3): Promise<Conversation | null> => {
    for (let i = 0; i < retries; i++) {
      try {
        await delay(Math.pow(2, i) * 1000); // Exponential backoff
        const conversation = await client.createConversation({
          uniqueName: sid,
          friendlyName: `Room ${sid}`
        });
        
        // Try to add participants
        await Promise.all(
          participants.map(async (identity) => {
            await conversation.add(identity);
          })
        );
        
        return conversation;
      } catch (error: any) {
        console.log(`Attempt ${i + 1} failed:`, error);
        
        // If conversation already exists, try to get it instead
        if (error.code === 50408) {
          const existingConversation = await tryGetConversation(client, sid, 3);
          if (existingConversation) {
            return existingConversation;
          }
        }
        
        // If we're out of retries, give up
        if (i === retries - 1) {
          throw error;
        }
      }
    }
    return null;
  };

  const ensureParticipant = async (conversation: Conversation, identity: string) => {
    try {
      const participants = await conversation.getParticipants().catch(err => {
        console.error('Failed to get participants:', err);
        return [];
      });
      
      console.log('Participants:', participants);
      const isParticipant = participants.some(p => p.identity === identity);
      
      if (!isParticipant) {
        await delay(1000);
        try {
          if (!conversation.client.isAuthenticated) {
            throw new Error('Client not authenticated');
          }
          await conversation.add(identity);
        } catch (error: any) {
          console.error('Failed to add participant:', error);
          if (error.code === 54007) {
            throw new Error('Identity not authorized to join conversation');
          }
          throw error;
        }
      }
    } catch (error) {
      console.error('Error in ensureParticipant:', error);
      throw error;
    }
  };

  useEffect(() => {
    const init = async () => {
      if (!identity?.trim() || !roomSid?.trim()) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        
        const response = await axios.post('/api/conversation/token', {
          identity,
          room: roomSid
        }, {
          headers: {
            'X-CSRFToken': getCsrfToken()
          },
          withCredentials: true,
        });

        const participants = response.data.data.data.participants;
        const client = new Client(response.data.data.data.token);
        
        client.on('connectionStateChanged', (state) => {
          if (state === 'connecting') setIsLoading(true);
          if (state === 'connected') setIsLoading(false);
          if (state === 'failed') setError('Connection failed');
        });

        setClient(client);

        if (roomSid) {
          try {
            await delay(2000);
            
            // First try to get existing conversation
            let conversation = await tryGetConversation(client, roomSid);
            console.log('Existing conversation:', conversation);
            
            if (!conversation) {
              // If no existing conversation, try to create one with retries
              try {
                conversation = await tryCreateConversation(
                  client, 
                  roomSid, 
                  [participants.patient, participants.doctor],
                  3
                );
              } catch (error: any) {
                // One final attempt to get the conversation in case another client created it
                conversation = await tryGetConversation(client, roomSid);
              }
            }

            if (conversation) {
              setActiveConversation(conversation);
            } else {
              throw new Error('Could not create or join conversation');
            }
          } catch (err) {
            setError('Failed to join conversation');
            console.error(err);
          }
        }

        setIsReady(true);
      } catch (error) {
        setError(error?.message || 'An error occurred');
        setIsLoading(false);
      }
    };

  if (identity?.trim() && roomSid?.trim()) {
    init();
  }

  return () => {
    setActiveConversation(null);
    setClient(null);
  };
}, [identity, roomSid]);

  const joinConversation = async (conversationSid: string) => {
    if (!client) {
      throw new Error('Client not initialized');
    }

    const conversation = await client.getConversationBySid(conversationSid);
    setActiveConversation(conversation);

    return conversation;
  };

  return {
    client,
    error,
    isLoading,
    isReady,
    activeConversation,
    joinConversation
  };
}

export default useConversations;