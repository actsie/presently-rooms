import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const ChatContainer = styled(motion.div)`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 320px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  z-index: 1000;
`;

const ChatHeader = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ChatTitle = styled.h3`
  margin: 0;
  font-size: 1rem;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  opacity: 0.8;
  
  &:hover {
    opacity: 1;
  }
`;

const MessagesContainer = styled.div`
  height: 300px;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Message = styled(motion.div)<{ $isOwn?: boolean }>`
  max-width: 80%;
  align-self: ${props => props.$isOwn ? 'flex-end' : 'flex-start'};
`;

const MessageBubble = styled.div<{ $isOwn?: boolean }>`
  background: ${props => props.$isOwn 
    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
    : '#f7fafc'};
  color: ${props => props.$isOwn ? 'white' : '#2d3748'};
  padding: 0.75rem 1rem;
  border-radius: ${props => props.$isOwn 
    ? '15px 15px 5px 15px' 
    : '15px 15px 15px 5px'};
  word-wrap: break-word;
`;

const MessageTime = styled.div<{ $isOwn?: boolean }>`
  font-size: 0.7rem;
  opacity: 0.6;
  margin-top: 0.25rem;
  text-align: ${props => props.$isOwn ? 'right' : 'left'};
`;

const InputContainer = styled.div`
  padding: 1rem;
  border-top: 1px solid #e2e8f0;
  display: flex;
  gap: 0.5rem;
`;

const MessageInput = styled.input`
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 25px;
  outline: none;
  
  &:focus {
    border-color: #667eea;
  }
`;

const SendButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  
  &:hover {
    transform: scale(1.1);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const ChatToggle = styled(motion.button)`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  box-shadow: 0 5px 20px rgba(102, 126, 234, 0.3);
  z-index: 999;
`;

interface ChatProps {
  messages: any[];
  sendMessage: (text: string) => void;
  participants: any[];
  localParticipant: any;
}

const Chat: React.FC<ChatProps> = ({ messages, sendMessage, participants, localParticipant }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (inputValue.trim()) {
      sendMessage(inputValue);
      setInputValue('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const getParticipantName = (fromId: string) => {
    if (localParticipant && fromId === localParticipant.user_id) {
      return 'You';
    }
    const participant = participants.find(p => p.user_id === fromId);
    return participant?.user_name || 'Guest';
  };

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <ChatContainer
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: 'spring', duration: 0.3 }}
          >
            <ChatHeader>
              <ChatTitle>Chat</ChatTitle>
              <CloseButton onClick={() => setIsOpen(false)}>×</CloseButton>
            </ChatHeader>
            
            <MessagesContainer>
              {messages.map((message) => {
                const isOwn = localParticipant && message.fromId === localParticipant.user_id;
                return (
                  <Message
                    key={message.id}
                    $isOwn={isOwn}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <MessageBubble $isOwn={isOwn}>
                      {!isOwn && (
                        <div style={{ fontSize: '0.8rem', opacity: 0.8, marginBottom: '0.25rem' }}>
                          {getParticipantName(message.fromId)}
                        </div>
                      )}
                      {message.text}
                    </MessageBubble>
                    <MessageTime $isOwn={isOwn}>
                      {formatTime(message.timestamp)}
                    </MessageTime>
                  </Message>
                );
              })}
              <div ref={messagesEndRef} />
            </MessagesContainer>
            
            <InputContainer>
              <MessageInput
                type="text"
                placeholder="Type a message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <SendButton 
                onClick={handleSend}
                disabled={!inputValue.trim()}
              >
                📤
              </SendButton>
            </InputContainer>
          </ChatContainer>
        )}
      </AnimatePresence>
      
      {!isOpen && (
        <ChatToggle
          onClick={() => setIsOpen(true)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          💬
        </ChatToggle>
      )}
    </>
  );
};

export default Chat;