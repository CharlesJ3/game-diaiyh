import React from 'react';
import styled, { keyframes } from 'styled-components';

const TrainingContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  max-height: 100%; 
  border: 2px solid #333;
  border-radius: 8px;
  background-color: #f0f0f0;
  overflow: hidden;
`;

const LeftSection = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  border-right: 1px solid #ccc;
  font-size: 24px;
  color: #666;
`;

const RightSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  max-height: 100%;
  overflow-y: auto;
  padding: 20px;
`;

const TrainingListSection = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  max-height: 100%;
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.02);
  }
  100% {
    transform: scale(1);
  }
`;

const TrainingItem = styled.div<{ $active: boolean, $progress: number, $canActivate: boolean }>`
  position: relative;
  background-color: ${props => props.$canActivate ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)'};
  padding: 15px;
  border-radius: 8px;
  border: 2px solid ${props => props.$active ? '#4caf50' : props.$canActivate ? '#4caf50' : '#f44336'};
  transition: all 0.3s ease;
  overflow: hidden;
  cursor: pointer;
  margin-bottom: 15px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);

  &:hover {
    background-color: ${props => props.$canActivate ? 'rgba(76, 175, 80, 0.2)' : 'rgba(244, 67, 54, 0.2)'};
    animation: ${pulse} 0.5s ease-in-out;
  }

  &:active {
    transform: scale(0.98);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: ${props => props.$progress}%;
    background-color: rgba(76, 175, 80, 0.2);
    transition: width 0.3s ease-in-out;
    z-index: 1;
  }
`;

const TrainingContent = styled.div`
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const TrainingInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TrainingTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  color: #333;
`;

const TrainingStats = styled.div`
  display: flex;
  gap: 15px;
`;

const StatItem = styled.span`
  font-size: 14px;
  color: #666;
`;

const ToggleButton = styled.button<{ $canActivate: boolean }>`
  padding: 8px 15px;
  background-color: ${props => props.$canActivate ? '#4caf50' : '#f44336'};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: ${props => props.$canActivate ? 'pointer' : 'not-allowed'};
  transition: background-color 0.3s ease;
  font-size: 14px;

  &:hover, &:focus {
    background-color: ${props => props.$canActivate ? '#45a049' : '#d32f2f'};
  }
`;

const SpeedProgressBarContainer = styled.div`
  width: 100%;
  height: 6px;
  background-color: #e0e0e0;
  border-radius: 3px;
  overflow: hidden;
`;

const SpeedProgressBar = styled.div<{ $progress: number }>`
  height: 100%;
  width: ${props => props.$progress}%;
  background-color: #2196f3;
`;

interface TrainingItem {
  title: string;
  level: number;
  category: {
    school: string;
    work: string;
  };
  xp: number;
  currentLevel: number;
  maxXp: number;
  active: boolean;
  unlocked: boolean;
  unlockHow: string;
  xpGain: number;
  speed: number;
  currentSpeed: number;
  trainingPointsRequired: number;
}

interface Character {
  name: string;
  title: string;
  overallXp: number;
  overallLevel: number;
  overallMaxXp: number;
  trainingOverallXp: number;
  trainingOverallLevel: number;
  trainingMaxXp: number;
  overallTrainingPoints: number;
  activeTrainingPoints: number;
}

type TrainProps = {
  training: TrainingItem[];
  setTraining: React.Dispatch<React.SetStateAction<TrainingItem[]>>;
  character: Character;
  setCharacter: React.Dispatch<React.SetStateAction<Character>>;
  toggleTrainingActive: (index: number) => void;
};

const Train: React.FC<TrainProps> = ({ training, setTraining, character, setCharacter, toggleTrainingActive }) => {
  const canActivateTraining = (item: TrainingItem) => {
    if (item.active) return true;
    return character.overallTrainingPoints - character.activeTrainingPoints >= item.trainingPointsRequired;
  };

  return (
    <TrainingContainer>
      <LeftSection>Progress Section</LeftSection>
      <RightSection>
        <TrainingListSection>
          {training.map((item, index) => (
            <TrainingItem
              key={index}
              $active={item.active}
              $progress={(item.xp / item.maxXp) * 100}
              $canActivate={canActivateTraining(item)}
              onClick={() => toggleTrainingActive(index)}
            >
              <TrainingContent>
                <TrainingInfo>
                  <TrainingTitle>{item.title}</TrainingTitle>
                  <ToggleButton
                    $canActivate={canActivateTraining(item)}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleTrainingActive(index);
                    }}
                    disabled={!canActivateTraining(item)}
                  >
                    {item.active ? 'Deactivate' : 'Activate'}
                  </ToggleButton>
                </TrainingInfo>
                <TrainingStats>
                  <StatItem>Level: {item.currentLevel}</StatItem>
                  <StatItem>XP: {item.xp}/{item.maxXp}</StatItem>
                  <StatItem>Speed: {item.speed / 1000}s</StatItem>
                  <StatItem>Gain: {item.xpGain}/tick</StatItem>
                  <StatItem>Required Training: {item.trainingPointsRequired}</StatItem>
                </TrainingStats>
                <SpeedProgressBarContainer>
                  <SpeedProgressBar $progress={(item.currentSpeed / item.speed) * 100} />
                </SpeedProgressBarContainer>
              </TrainingContent>
            </TrainingItem>
          ))}
        </TrainingListSection>
      </RightSection>
    </TrainingContainer>
  );
};

export default Train;