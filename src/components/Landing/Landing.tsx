import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { EnergyLevel, SupportType, UserPreferences } from '../../types';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const Card = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 3rem;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #2d3748;
  margin-bottom: 0.5rem;
  text-align: center;
`;

const Subtitle = styled.p`
  color: #718096;
  text-align: center;
  margin-bottom: 2rem;
  font-size: 1.1rem;
`;

const Question = styled(motion.div)`
  margin-bottom: 2rem;
`;

const QuestionTitle = styled.h3`
  color: #2d3748;
  margin-bottom: 1rem;
  font-size: 1.2rem;
`;

const OptionGrid = styled.div`
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
`;

const Option = styled.button<{ $selected: boolean }>`
  padding: 1rem;
  background: ${props => props.$selected ? '#667eea' : '#f7fafc'};
  color: ${props => props.$selected ? 'white' : '#4a5568'};
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  border: 2px solid ${props => props.$selected ? '#667eea' : '#e2e8f0'};

  &:hover {
    background: ${props => props.$selected ? '#5a67d8' : '#edf2f7'};
    border-color: #667eea;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
  }

  &::placeholder {
    color: #a0aec0;
  }
`;

const Button = styled(motion.button)`
  width: 100%;
  padding: 1.2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  margin-top: 1rem;
`;

const MicroCopy = styled.p`
  text-align: center;
  color: #718096;
  font-size: 0.9rem;
  margin-top: 1rem;
  font-style: italic;
`;

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [preferences, setPreferences] = useState<Partial<UserPreferences>>({});

  const handleEnergyLevel = (level: EnergyLevel) => {
    setPreferences({ ...preferences, energyLevel: level });
    setStep(1);
  };

  const handleSupportType = (type: SupportType) => {
    setPreferences({ ...preferences, supportType: type });
    setStep(2);
  };

  const handleNameChoice = (isAnonymous: boolean, name?: string) => {
    const finalPreferences: UserPreferences = {
      energyLevel: preferences.energyLevel!,
      supportType: preferences.supportType!,
      displayName: name,
      isAnonymous
    };
    
    navigate('/room', { state: { preferences: finalPreferences } });
  };

  return (
    <Container>
      <Card
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Title>Presently</Title>
        <Subtitle>Your gentle coworking space</Subtitle>

        <AnimatePresence mode="wait">
          {step === 0 && (
            <Question
              key="energy"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <QuestionTitle>How's your energy today?</QuestionTitle>
              <OptionGrid>
                <Option 
                  $selected={preferences.energyLevel === 'low'}
                  onClick={() => handleEnergyLevel('low')}
                >
                  🌙 Low
                </Option>
                <Option 
                  $selected={preferences.energyLevel === 'medium'}
                  onClick={() => handleEnergyLevel('medium')}
                >
                  ☁️ Medium
                </Option>
                <Option 
                  $selected={preferences.energyLevel === 'high'}
                  onClick={() => handleEnergyLevel('high')}
                >
                  ⚡ High
                </Option>
              </OptionGrid>
              <MicroCopy>It's okay to feel however you feel</MicroCopy>
            </Question>
          )}

          {step === 1 && (
            <Question
              key="support"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <QuestionTitle>What kind of support would help?</QuestionTitle>
              <OptionGrid>
                <Option 
                  $selected={preferences.supportType === 'silence'}
                  onClick={() => handleSupportType('silence')}
                >
                  🤫 Silence
                </Option>
                <Option 
                  $selected={preferences.supportType === 'music'}
                  onClick={() => handleSupportType('music')}
                >
                  🎵 Music
                </Option>
                <Option 
                  $selected={preferences.supportType === 'check-ins'}
                  onClick={() => handleSupportType('check-ins')}
                >
                  💬 Check-ins
                </Option>
              </OptionGrid>
              <MicroCopy>You can always switch rooms later</MicroCopy>
            </Question>
          )}

          {step === 2 && (
            <Question
              key="name"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <QuestionTitle>How would you like to appear?</QuestionTitle>
              <Input
                type="text"
                placeholder="Your name (optional)"
                onChange={(e) => setPreferences({ ...preferences, displayName: e.target.value })}
              />
              <Button
                onClick={() => handleNameChoice(false, preferences.displayName)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Join with name
              </Button>
              <Button
                onClick={() => handleNameChoice(true)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{ 
                  background: '#f7fafc', 
                  color: '#4a5568',
                  border: '2px solid #e2e8f0'
                }}
              >
                Stay semi-anonymous
              </Button>
              <MicroCopy>You're not alone. No pressure to talk.</MicroCopy>
            </Question>
          )}
        </AnimatePresence>
      </Card>
    </Container>
  );
};

export default Landing;