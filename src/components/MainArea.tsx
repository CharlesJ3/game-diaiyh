import React from 'react';
import styled from 'styled-components';
import ThreeScene from './ThreeScene';

const MainAreaContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 20px;
  width: 100vw;
  position: relative;
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

const ThreeSceneWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50vw;
  height: 50vh;
  z-index: 10;
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
  overallTrainingPoints: number;
  activeTrainingPoints: number;
}

interface TrainingItem {
  title: string;
  currentLevel: number;
  xp: number;
  maxXp: number;
  active: boolean;
  speed: number;
  xpGain: number;
  currentSpeed: number;
  trainingPointsRequired: number;
}

interface MainAreaProps {
  character: Character;
  training: TrainingItem[];
  setCharacter: React.Dispatch<React.SetStateAction<Character>>;
  setTraining: React.Dispatch<React.SetStateAction<TrainingItem[]>>;
  toggleTrainingActive: (index: number) => void;
  children?: React.ReactNode;
}

const MainArea: React.FC<MainAreaProps> = ({
  character,
  training,
  setCharacter,
  setTraining,
  toggleTrainingActive,
  children
}) => {
  return (
    <MainAreaContainer>
      <QuadrantContainer>
        <CharacterInfo>
          <h2>Character Information</h2>
          <p>Name: {character.name}</p>
          <p>Title: {character.title}</p>
          <p>Overall Level: {character.overallLevel}</p>
          <p>Overall XP: {character.overallXp} / {character.overallMaxXp}</p>
          <p>Training Level: {character.trainingOverallLevel}</p>
          <p>Training XP: {character.trainingOverallXp} / {character.trainingMaxXp}</p>
          <p>Training Points: {character.activeTrainingPoints} / {character.overallTrainingPoints}</p>
        </CharacterInfo>
      </QuadrantContainer>
      <QuadrantContainer>
        {/* More quick access stuff here, either Play or Compete */}
      </QuadrantContainer>
      <QuadrantContainer>
        {children}
      </QuadrantContainer>
      <QuadrantContainer>
        {/* More quick access stuff here, either Play or Compete */}
      </QuadrantContainer>
      <ThreeSceneWrapper>
        <ThreeScene />
      </ThreeSceneWrapper>
    </MainAreaContainer>
  );
};

export default MainArea;