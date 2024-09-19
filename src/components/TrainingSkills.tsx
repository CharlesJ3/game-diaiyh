import React, { useRef, useEffect, useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import backgroundImage from '../assets/training-image-skill-background.png'

const TrainingSkillsContainer = styled.div`
  display: flex;
  gap: 8px;
  padding: 20px;
  background-image: url(${backgroundImage});
  background-size: cover;
  background-position: center;
  min-height: 100vh;
  align-items: flex-start;
  overflow-y: hidden;
  position: relative;
`;

const OverlayWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1;
`;

const ContentWrapper = styled.div`
  display: flex;
  gap: 8px;
  position: relative;
  z-index: 2;
  width: 100%;
`;

const SkillColumn = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ColumnTitle = styled.h2`
  color: white;
  text-align: center;
  margin-bottom: 10px;
  font-size: 14px;
`;

const pulseBorder = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(33, 150, 243, 0.4);
  }
  70% {
    box-shadow: 0 0 0 0 rgba(33, 150, 243, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(33, 150, 243, 0);
  }
`;

const SkillCard = styled.div<{ $isActive: boolean; $canUpgrade: boolean; $isRequired: boolean; $canActivate: boolean }>`
  width: 50%;
  height: 50px;
  border: 4px solid ${props => props.$canUpgrade ? '#4caf50' : props.$isActive ? '#2196f3' : '#f44336'};
  border-radius: 8px;
  transition: all 0.3s ease;
  cursor: pointer;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
  z-index: 1;
  background-color: ${props => props.$canActivate ? 'transparent' : 'rgba(244, 67, 54, 0.3)'};

  ${props => props.$isRequired && css`
    animation: ${css`${pulseBorder} 2s infinite`};
  `}
`;

const SkillTooltip = styled.div<{ $isRightSide: boolean }>`
  position: fixed;
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 12px;
  border-radius: 8px;
  z-index: 1000;
  max-width: 250px;
  pointer-events: none;
  ${props => props.$isRightSide ? 'left: calc(100% + 10px);' : 'right: calc(100% + 10px);'}
  top: 50%;
  transform: translateY(-50%);
`;

const TooltipContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const TooltipTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  border-bottom: 1px solid white;
  padding-bottom: 4px;
`;

const TooltipInfo = styled.p`
  margin: 0;
  font-size: 12px;
`;

const ProgressBar = styled.div<{ $progress: number; $canUpgrade: boolean }>`
  width: 100%;
  height: 100%;
  background-color: ${props => props.$canUpgrade ? '#e0e0e0' : '#ffcccb'};
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: ${props => props.$progress}%;
    background-color: #4caf50;
    transition: height 0.3s ease;
  }
`;

const SkillLevel = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 13px;
  font-weight: bold;
  color: #333;
`;

const SkillCardWrapper = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 25px;
`;

const ConnectionSvg = styled.svg`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
`;

interface TrainingTalent {
  id: number;
  name: string;
  talentSkillCost: number;
  description: string;
  currentLevel: number;
  maxLevel: number;
  perLevelMultiplier: number;
  requiredTalentSkills: number[];
  active: boolean;
  type: ('Strength' | 'Intellect' | 'Speed')[];
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
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
  const [, forceUpdate] = useState({});
  const [hoveredTalent, setHoveredTalent] = useState<TrainingTalent | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [requiredTalents, setRequiredTalents] = useState<number[]>([]);

  const canActivate = (talent: TrainingTalent): boolean => {
    return talent.requiredTalentSkills.every(reqId =>
      trainingTalents.find(t => t.id === reqId && t.active)
    );
  };

  const canUpgrade = (talent: TrainingTalent): boolean => {
    const hasEnoughPoints = character.trainingTalentPoints >= talent.talentSkillCost;
    const isNotMaxLevel = talent.currentLevel < talent.maxLevel;
    return hasEnoughPoints && isNotMaxLevel && canActivate(talent);
  };

  const upgradeSkill = (id: number) => {
    const talent = trainingTalents.find(t => t.id === id);
    if (talent && canUpgrade(talent)) {
      setTrainingTalents(prevTalents => prevTalents.map(t =>
        t.id === id ? { ...t, currentLevel: t.currentLevel + 1, active: true } : t
      ));
      setCharacter(prevCharacter => ({
        ...prevCharacter,
        trainingTalentPoints: prevCharacter.trainingTalentPoints - talent.talentSkillCost
      }));
    }
  };

  const getColumnForTalent = (talent: TrainingTalent): number => {
    const { type } = talent;
    if (type.includes('Strength') && type.includes('Intellect')) return 1;
    if (type.includes('Strength') && type.includes('Speed')) return 5;
    if (type.includes('Intellect') && type.includes('Speed')) return 3;
    if (type.includes('Strength')) return 0;
    if (type.includes('Intellect')) return 2;
    if (type.includes('Speed')) return 4;
    return -1;
  };

  const columnTitles = [
    'Strength',
    'Strength & Intellect \n\n',
    'Intellect',
    'Intellect & Speed \n\n',
    'Speed',
    'Strength & Speed \n\n'
  ];

  const handleMouseEnter = (talent: TrainingTalent) => {
    setHoveredTalent(talent);
    setRequiredTalents(talent.requiredTalentSkills);
  };

  const handleMouseLeave = () => {
    setHoveredTalent(null);
    setRequiredTalents([]);
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    setMousePosition({ x: event.clientX, y: event.clientY });
  };

  const renderSkillCard = (talent: TrainingTalent) => (
    <SkillCardWrapper
      key={talent.id}
      ref={el => cardRefs.current[talent.id] = el}
      onMouseEnter={() => handleMouseEnter(talent)}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      <SkillCard
        $isActive={talent.active}
        $canUpgrade={canUpgrade(talent)}
        $isRequired={requiredTalents.includes(talent.id)}
        $canActivate={canActivate(talent)}
        onClick={() => upgradeSkill(talent.id)}
      >
        <ProgressBar
          $progress={(talent.currentLevel / talent.maxLevel) * 100}
          $canUpgrade={canUpgrade(talent)}
        />
        <SkillLevel>{talent.currentLevel}/{talent.maxLevel}</SkillLevel>
      </SkillCard>
    </SkillCardWrapper>
  );

  const renderTooltip = () => {
    if (!hoveredTalent) return null;

    const columnIndex = getColumnForTalent(hoveredTalent);
    const isRightSide = columnIndex < 3;

    return (
      <SkillTooltip
        $isRightSide={isRightSide}
        style={{
          top: `${mousePosition.y}px`,
          [isRightSide ? 'left' : 'right']: `${isRightSide ? mousePosition.x + 10 : window.innerWidth - mousePosition.x + 10}px`,
        }}
      >
        <TooltipContent>
          <TooltipTitle>{hoveredTalent.name}</TooltipTitle>
          <TooltipInfo>Description: {hoveredTalent.description}</TooltipInfo>
          <TooltipInfo>Current Level: {hoveredTalent.currentLevel}</TooltipInfo>
          <TooltipInfo>Max Level: {hoveredTalent.maxLevel}</TooltipInfo>
          <TooltipInfo>Cost: {hoveredTalent.talentSkillCost}</TooltipInfo>
          <TooltipInfo>Per Level Multiplier: {hoveredTalent.perLevelMultiplier}</TooltipInfo>
          <TooltipInfo>Type: {hoveredTalent.type.join(', ')}</TooltipInfo>
          <TooltipInfo>Active: {hoveredTalent.active ? 'Yes' : 'No'}</TooltipInfo>
          <TooltipInfo>Required Talents: {hoveredTalent.requiredTalentSkills.join(', ')}</TooltipInfo>
        </TooltipContent>
      </SkillTooltip>
    );
  };

  const renderColumns = () => {
    const columns: JSX.Element[][] = [[], [], [], [], [], []];

    trainingTalents.forEach(talent => {
      const columnIndex = getColumnForTalent(talent);
      if (columnIndex !== -1) {
        columns[columnIndex].push(renderSkillCard(talent));
      }
    });

    return columns.map((column, index) => (
      <SkillColumn key={index}>
        <ColumnTitle>{columnTitles[index]}</ColumnTitle>
        {column}
      </SkillColumn>
    ));
  };

  const drawConnections = () => {
    if (!containerRef.current) return null;

    const connections: JSX.Element[] = [];

    trainingTalents.forEach(talent => {
      talent.requiredTalentSkills.forEach(requiredId => {
        const startCard = cardRefs.current[requiredId];
        const endCard = cardRefs.current[talent.id];

        if (startCard && endCard) {
          const startRect = startCard.getBoundingClientRect();
          const endRect = endCard.getBoundingClientRect();
          const containerRect = containerRef.current!.getBoundingClientRect();

          const startX = startRect.left - containerRect.left + startRect.width / 2;
          const startY = startRect.top - containerRect.top + startRect.height / 2;
          const endX = endRect.left - containerRect.left + endRect.width / 2;
          const endY = endRect.top - containerRect.top + endRect.height / 2;

          const requiredTalent = trainingTalents.find(t => t.id === requiredId);
          const isActive = requiredTalent?.active || false;
          const color = isActive ? '#2196f3' : '#f44336';

          connections.push(
            <path
              key={`${requiredId}-${talent.id}`}
              d={`M${startX},${startY} C${startX},${(startY + endY) / 2} ${endX},${(startY + endY) / 2} ${endX},${endY}`}
              fill="none"
              stroke={color}
              strokeWidth="5"
              opacity={0.9}
            />
          );
        }
      });
    });

    return (
      <ConnectionSvg>
        {connections}
      </ConnectionSvg>
    );
  };

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      forceUpdate({});
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      forceUpdate({});
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  return (
    <TrainingSkillsContainer ref={containerRef}>
      <OverlayWrapper />
      <ContentWrapper>
        {renderColumns()}
        {drawConnections()}
      </ContentWrapper>
      {renderTooltip()}
    </TrainingSkillsContainer>
  );
};

export default TrainingSkills;