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

const SkillCard = styled.div<{ $isActive: boolean; $canUpgrade: boolean; $isRequired: boolean }>`
  width: 100%;
  height: 90px;
  background-color: ${props => props.$canUpgrade ? 'rgba(200, 250, 200, 0.9)' : props.$isActive ? 'rgba(224, 247, 250, 0.9)' : 'rgba(250, 200, 200, 0.9)'};
  border: ${props => props.$isRequired ? '4px' : '2px'} solid ${props => props.$canUpgrade ? '#4caf50' : props.$isActive ? '#2196f3' : '#f44336'};
  border-radius: 8px;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  z-index: 1;

  &:hover {
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  }

  ${props => props.$isRequired && css`
    animation: ${css`${pulseBorder} 2s infinite`};
  `}
`;

const SkillTooltip = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 8px;
  opacity: 0;
  transition: opacity 0.3s ease;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;

  ${SkillCard}:hover & {
    opacity: 1;
  }
`;

const SkillName = styled.h3`
  margin: 0 0 4px 0;
  font-size: 11px;
`;

const SkillDescription = styled.p`
  margin: 0 0 2px 0;
  font-size: 9px;
`;

const ProgressBar = styled.div<{ $progress: number }>`
  width: 100%;
  height: 100%;
  background-color: #e0e0e0;
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
  margin-bottom: 10px;
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
  const [hoveredTalent, setHoveredTalent] = useState<number | null>(null);
  const [requiredTalents, setRequiredTalents] = useState<number[]>([]);

  const canUpgrade = (talent: TrainingTalent): boolean => {
    const hasEnoughPoints = character.trainingTalentPoints >= talent.talentSkillCost;
    const isNotMaxLevel = talent.currentLevel < talent.maxLevel;
    const hasRequiredTalents = talent.requiredTalentSkills.every(reqId =>
      trainingTalents.find(t => t.id === reqId && t.active)
    );

    return hasEnoughPoints && isNotMaxLevel && hasRequiredTalents;
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
    } else {
      console.log("Cannot upgrade talent:", talent?.name);
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

  const handleMouseEnter = (talentId: number) => {
    setHoveredTalent(talentId);
    const talent = trainingTalents.find(t => t.id === talentId);
    if (talent) {
      setRequiredTalents(talent.requiredTalentSkills);
    }
  };

  const handleMouseLeave = () => {
    setHoveredTalent(null);
    setRequiredTalents([]);
  };

  const renderSkillCard = (talent: TrainingTalent) => (
    <SkillCardWrapper
      key={talent.id}
      ref={el => cardRefs.current[talent.id] = el}
      onMouseEnter={() => handleMouseEnter(talent.id)}
      onMouseLeave={handleMouseLeave}
    >
      <SkillCard
        $isActive={talent.active}
        $canUpgrade={canUpgrade(talent)}
        $isRequired={requiredTalents.includes(talent.id)}
        onClick={() => upgradeSkill(talent.id)}
      >
        <ProgressBar $progress={(talent.currentLevel / talent.maxLevel) * 100} />
        <SkillLevel>{talent.currentLevel}/{talent.maxLevel}</SkillLevel>
        <SkillTooltip>
          <SkillName>{talent.name}</SkillName>
          <SkillDescription>{talent.description}</SkillDescription>
          <SkillDescription>Cost: {talent.talentSkillCost}</SkillDescription>
        </SkillTooltip>
      </SkillCard>
    </SkillCardWrapper>
  );

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
          const isHovered = hoveredTalent === talent.id || hoveredTalent === requiredId;

          connections.push(
            <g key={`${requiredId}-${talent.id}`}>
              <path
                d={`M${startX},${startY} C${startX},${(startY + endY) / 2} ${endX},${(startY + endY) / 2} ${endX},${endY}`}
                fill="none"
                stroke={color}
                strokeWidth={isHovered ? "5" : "3"}
                markerEnd={`url(#arrowhead-${isActive ? 'active' : 'inactive'}${isHovered ? '-hovered' : ''})`}
                opacity={isHovered ? 1 : 0.7}
                transition="all 0.3s ease"
              />
            </g>
          );
        }
      });
    });

    return (
      <ConnectionSvg>
        <defs>
          <marker
            id="arrowhead-active"
            markerWidth="10"
            markerHeight="7"
            refX="0"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="#2196f3" />
          </marker>
          <marker
            id="arrowhead-inactive"
            markerWidth="10"
            markerHeight="7"
            refX="0"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="#f44336" />
          </marker>
          <marker
            id="arrowhead-active-hovered"
            markerWidth="12"
            markerHeight="9"
            refX="0"
            refY="4.5"
            orient="auto"
          >
            <polygon points="0 0, 12 4.5, 0 9" fill="#2196f3" />
          </marker>
          <marker
            id="arrowhead-inactive-hovered"
            markerWidth="12"
            markerHeight="9"
            refX="0"
            refY="4.5"
            orient="auto"
          >
            <polygon points="0 0, 12 4.5, 0 9" fill="#f44336" />
          </marker>
        </defs>
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
      {renderColumns()}
      {drawConnections()}
    </TrainingSkillsContainer>
  );
};

export default TrainingSkills;