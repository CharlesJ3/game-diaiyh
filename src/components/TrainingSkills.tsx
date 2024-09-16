import React from 'react';
import styled from 'styled-components';
import backgroundImage from '../assets/training-image-skill-background.png'

const TrainingSkillsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  background-image: url(${backgroundImage});
  background-size: cover;
  background-position: center;
  min-height: 100vh;
`;

const SkillCard = styled.div<{ $isActive: boolean }>`
  background-color: ${props => props.$isActive ? 'rgba(224, 247, 250, 0.9)' : 'rgba(245, 245, 245, 0.9)'};
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 15px;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  }
`;

const SkillName = styled.h3`
  margin: 0 0 10px 0;
`;

const SkillDescription = styled.p`
  margin: 0 0 10px 0;
  color: #666;
`;

const SkillProgress = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ProgressBar = styled.div<{ $progress: number }>`
  width: 100%;
  height: 10px;
  background-color: #e0e0e0;
  border-radius: 5px;
  overflow: hidden;

  &::after {
    content: '';
    display: block;
    width: ${props => props.$progress}%;
    height: 100%;
    background-color: #4caf50;
    transition: width 0.3s ease;
  }
`;

const UpgradeButton = styled.button<{ $canUpgrade: boolean }>`
  padding: 5px 10px;
  background-color: ${props => props.$canUpgrade ? '#4caf50' : '#ccc'};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: ${props => props.$canUpgrade ? 'pointer' : 'not-allowed'};
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${props => props.$canUpgrade ? '#45a049' : '#bbb'};
  }
`;

interface TrainingTalent {
  name: string;
  talentSkillCost: number;
  description: string;
  currentLevel: number;
  maxLevel: number;
  perLevelMultiplier: number;
  requiredTalentSkills: string[];
  active: boolean;
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
  overallTrainingPoints: number;
  activeTrainingPoints: number;
  trainingTalentPoints: number;
  overallTrainingTalentPoints: number;
}


interface TrainingSkillsProps {
  trainingTalents: TrainingTalent[];
  setTrainingTalents: React.Dispatch<React.SetStateAction<TrainingTalent[]>>;
  character: Character;
  setCharacter: React.Dispatch<React.SetStateAction<Character>>;
}

const TrainingSkills: React.FC<TrainingSkillsProps> = ({ trainingTalents, setTrainingTalents, character, setCharacter }) => {
  const upgradeSkill = (index: number) => {
    const talent = trainingTalents[index];
    if (character.trainingTalentPoints >= talent.talentSkillCost && talent.currentLevel < talent.maxLevel) {
      setTrainingTalents(prevTalents => {
        const newTalents = [...prevTalents];
        newTalents[index] = {
          ...talent,
          currentLevel: talent.currentLevel + 1,
          active: true
        };
        return newTalents;
      });
      setCharacter(prevCharacter => ({
        ...prevCharacter,
        trainingTalentPoints: prevCharacter.trainingTalentPoints - talent.talentSkillCost
      }));
    }
  };

  const canUpgrade = (talent: TrainingTalent) => {
    return character.trainingTalentPoints >= talent.talentSkillCost &&
      talent.currentLevel < talent.maxLevel &&
      talent.requiredTalentSkills.every(reqSkill =>
        trainingTalents.find(t => t.name === reqSkill)?.active
      );
  };

  return (
    <TrainingSkillsContainer>
      {trainingTalents.map((talent, index) => (
        <SkillCard key={talent.name} $isActive={talent.active}>
          <SkillName>{talent.name}</SkillName>
          <SkillDescription>{talent.description}</SkillDescription>
          <SkillProgress>
            <ProgressBar $progress={(talent.currentLevel / talent.maxLevel) * 100} />
            <span>{talent.currentLevel}/{talent.maxLevel}</span>
          </SkillProgress>
          <UpgradeButton
            onClick={() => upgradeSkill(index)}
            $canUpgrade={canUpgrade(talent)}
          >
            Upgrade (Cost: {talent.talentSkillCost})
          </UpgradeButton>
        </SkillCard>
      ))}
    </TrainingSkillsContainer>
  );
};

export default TrainingSkills;