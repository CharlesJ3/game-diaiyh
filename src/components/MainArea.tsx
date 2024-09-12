import React from 'react';
import styled, { keyframes } from 'styled-components';

const MainAreaContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 20px;
  height: 100%;
  width: 100%;
`;

const QuadrantContainer = styled.div`
  padding: 20px;
  overflow-y: auto;
`;

const CharacterInfo = styled.div`
  h2 {
    margin-bottom: 10px;
  }
  p {
    margin: 5px 0;
  }
`;

const TrainingList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

const fillAnimation = keyframes`
  0% {
    width: 0%;
  }
  100% {
    width: 100%;
  }
`;

const TrainingItem = styled.div<{ $active: boolean, $progress: number }>`
  position: relative;
  background-color: #f0f0f0;
  padding: 10px;
  border-radius: 5px;
  border: 2px solid ${props => props.$active ? '#4caf50' : 'transparent'};
  transition: all 0.3s ease;
  overflow: hidden;
  cursor: pointer;

  &:hover {
    background-color: #e0e0e0;
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
    height: calc(100% - 15px);
    width: ${props => props.$progress}%;
    background-color: rgba(76, 175, 80, 0.2);
    transition: width 0.3s ease-in-out;
    z-index: 1;
  }
`;

const SpeedProgressBar = styled.div<{ $duration: number }>`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 15px;
  width: 0%;
  background-color: rgba(33, 150, 243, 0.6);
  animation: ${fillAnimation} ${props => props.$duration}s linear infinite;
`;

const TrainingContent = styled.div`
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const TrainingInfo = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const TrainingTitle = styled.h3`
  margin: 0;
  width: 150px; // Adjust as needed
`;

const TrainingStats = styled.div`
  display: flex;
  gap: 10px;
`;

const StatItem = styled.span`
  font-size: 0.9em;
`;

const ToggleButton = styled.button`
  padding: 5px 10px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover, &:focus {
    background-color: #45a049;
  }
`;

interface Character {
  name: string;
  title: string;
  overallXp: number;
  overallLevel: number;
  overallMaxXp: number;
  trainingOverallXp: number;
  trainingOverallLevel: number;
  trainingMaxXp: number;
  trainingSpeed: number;
}

interface TrainingItem {
  title: string;
  currentLevel: number;
  xp: number;
  maxXp: number;
  active: boolean;
  xpGain: number;
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
  trainingSpeed: number;
}

interface MainAreaProps {
  character: Character;
  training: TrainingItem[];
  setCharacter: React.Dispatch<React.SetStateAction<Character>>;
  setTraining: React.Dispatch<React.SetStateAction<TrainingItem[]>>;
  toggleTrainingActive: (index: number) => void;
}

const MainArea: React.FC<MainAreaProps> = ({
  character,
  training,
  setCharacter,
  setTraining,
  toggleTrainingActive
}) => {
  const handleTrainingClick = (index: number) => {
    toggleTrainingActive(index);
  };

  return (
    <MainAreaContainer>
      <QuadrantContainer>
        <CharacterInfo>
          <h2>Character Information</h2>
          <p>Name: {character.name}</p>
          <p>Title: {character.title}</p>
          <p>Overall Level: {character.overallLevel}</p>
          <p>Overall XP: {Math.floor(character.overallXp)} / {character.overallMaxXp}</p>
          <p>Training Level: {character.trainingOverallLevel}</p>
          <p>Training XP: {Math.floor(character.trainingOverallXp)} / {character.trainingMaxXp}</p>
          <p>Training Speed: {character.trainingSpeed}s</p>
        </CharacterInfo>
      </QuadrantContainer>
      <QuadrantContainer>
        <h2>Training</h2>
        <TrainingList>
          {training.map((item, index) => (
            <TrainingItem
              key={index}
              $active={item.active}
              $progress={(item.xp / item.maxXp) * 100}
              onClick={() => handleTrainingClick(index)}
            >
              <TrainingContent>
                <TrainingInfo>
                  <TrainingTitle>{item.title}</TrainingTitle>
                  <TrainingStats>
                    <StatItem>Lvl: {item.currentLevel}</StatItem>
                    <StatItem>XP: {Math.floor(item.xp)}/{item.maxXp}</StatItem>
                    <StatItem>Gain: {item.xpGain}/tick</StatItem>
                  </TrainingStats>
                </TrainingInfo>
                <ToggleButton onClick={(e) => {
                  e.stopPropagation();
                  toggleTrainingActive(index);
                }}>
                  {item.active ? 'Deactivate' : 'Activate'}
                </ToggleButton>
              </TrainingContent>
              {item.active && <SpeedProgressBar $duration={character.trainingSpeed} />}
            </TrainingItem>
          ))}
        </TrainingList>
      </QuadrantContainer>
      <QuadrantContainer>
        {/* Reserved for future content */}
      </QuadrantContainer>
      <QuadrantContainer>
        {/* Reserved for future content */}
      </QuadrantContainer>
    </MainAreaContainer>
  );
};

export default MainArea;