import React from 'react';
import styled from 'styled-components';

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
`;

const TrainingListSection = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  max-height: 100%;
`;

const TrainingItem = styled.div`
  margin-bottom: 10px;
  padding: 10px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

type TrainProps = {
  training: any[];
  setTraining: (training: any[]) => void;
  character: any;
  setCharacter: (character: any) => void;
};

const Train: React.FC<TrainProps> = ({ training, setTraining, character, setCharacter }) => {
  return (
    <TrainingContainer>
      <LeftSection>Progress Section</LeftSection>
      <RightSection>
        <TrainingListSection>
          {training.map((item, index) => (
            <TrainingItem key={index}>
              <h3>{item.title}</h3>
              <p>Level: {item.currentLevel}</p>
              <p>XP: {item.xp} / {item.maxXp} </p>
              <p>Category: School - {item.category.school}, Work - {item.category.work}</p>
              <p>Active: {item.active ? 'Yes' : 'No'}</p>
              <p>Unlocked: {item.unlocked ? 'Yes' : 'No'}</p>
              {!item.unlocked && <p>How to unlock: {item.unlockHow}</p>}
            </TrainingItem>
          ))}
        </TrainingListSection>
      </RightSection>
    </TrainingContainer>
  );
};

export default Train;