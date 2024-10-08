import React, { useState, useMemo } from 'react';
import styled from 'styled-components';

interface StatItem {
  xp: number;
  maxXp: number;
  level: number;
  prestigeXp: number;
  prestigeMaxXp: number;
  prestigeLevel: number;
  active: boolean;
}

interface Character {
  name: string;
  title: string;
  training: {
    school: { [key: string]: StatItem };
    work: { [key: string]: StatItem };
  };
  play: {
    type: { [key: string]: StatItem };
    subcategory: { [key: string]: StatItem };
  };
  compete: {
    type: { [key: string]: StatItem };
  };
}

interface HeaderProps {
  character: Character;
}

const HeaderContainer = styled.header<{ $expanded: boolean }>`
  background-color: #1f2937;
  color: white;
  border-bottom: 2px solid #4b5563;
  transition: max-height 0.3s ease-in-out, padding 0.3s ease-in-out;
  overflow: hidden;
  max-height: ${props => props.$expanded ? '90vh' : '20vh'};
  position: relative;
`;

const HeaderContent = styled.div<{ $expanded: boolean; $activeSkillCount: number }>`
  padding: 0.5rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  max-height: ${props => props.$expanded ? 'calc(90vh - 40px)' : props.$activeSkillCount > 7 ? '15vh' : '8vh'};
  min-height: ${props => props.$activeSkillCount > 7 ? '15vh' : '8vh'};
  overflow-y: auto;
`;

const ToggleButton = styled.button`
  background-color: #374151;
  color: white;
  border: none;
  padding: 0.5rem 0.5rem;
  cursor: pointer;
  font-size: 0.9rem;
  position: absolute;
  top: 0;
  right: 0;
  z-index: 10;

  &:hover {
    background-color: #4b5563;
  }
`;

const StatCategory = styled.div`
  width: calc(33.333% - 0.5rem);
  min-width: 250px;
`;

const CategoryTitle = styled.h2`
  font-weight: bold;
  text-transform: capitalize;
  margin-bottom: 0.25rem;
  color: #fde68a;
  font-size: 1rem;
`;

const StatGroup = styled.div`
  background-color: #374151;
  border-radius: 0.25rem;
  padding: 0.25rem;
  margin-bottom: 0.25rem;
`;

const GroupTitle = styled.h3`
  font-weight: bold;
  margin-bottom: 0.125rem;
  color: #d1d5db;
  font-size: 0.9rem;
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 0.25rem;
`;

const StatName = styled.span`
  color: #9ca3af;
  font-size: 0.7rem;
  margin-bottom: 0.125rem;
`;

const XPBarContainer = styled.div`
  display: flex;
  gap: 0.25rem;
  height: 16px;
`;

const XPBar = styled.div<{ $color: 'blue' | 'purple' }>`
  flex: 1;
  background-color: #4b5563;
  border-radius: 2px;
  overflow: hidden;
  position: relative;
`;

const XPBarFill = styled.div<{ $progress: number; $color: 'blue' | 'purple' }>`
  height: 100%;
  width: ${props => props.$progress}%;
  background-color: ${props => props.$color === 'blue' ? '#2196f3' : '#9c27b0'};
`;

const XPText = styled.span`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 0.6rem;
  color: white;
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.5);
  white-space: nowrap;
`;

const CollapsedStatItem = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 0.5rem;
  width: 250px;
`;

const CollapsedStatName = styled.span`
  color: white;
  font-size: 0.8rem;
  margin-bottom: 0.25rem;
`;

const CollapsedXPBarContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  height: 40px;
`;

const NoActiveSkillsMessage = styled.p`
  color: #9ca3af;
  font-size: 0.9rem;
  text-align: center;
  margin-top: 1rem;
`;

const Header: React.FC<HeaderProps> = ({ character }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const calculateXP = (xp: number, maxXp: number) => {
    return Math.min((xp / maxXp) * 100, 100);
  };

  const activeSkillCount = useMemo(() => {
    return Object.values(character.training.school).filter(skill => skill.active).length +
           Object.values(character.training.work).filter(skill => skill.active).length +
           Object.values(character.play.type).filter(skill => skill.active).length +
           Object.values(character.play.subcategory).filter(skill => skill.active).length +
           Object.values(character.compete.type).filter(skill => skill.active).length;
  }, [character]);

  const renderXPBars = (stat: string, value: StatItem) => (
    <StatItem key={stat}>
      <StatName>{stat}</StatName>
      <XPBarContainer>
        <XPBar $color="blue">
          <XPBarFill $progress={calculateXP(value.xp, value.maxXp)} $color="blue" />
          <XPText>XP: {value.xp}/{value.maxXp}</XPText>
        </XPBar>
        <XPBar $color="purple">
          <XPBarFill $progress={calculateXP(value.prestigeXp, value.prestigeMaxXp)} $color="purple" />
          <XPText>PXP: {value.prestigeXp}/{value.prestigeMaxXp}</XPText>
        </XPBar>
      </XPBarContainer>
    </StatItem>
  );

  const renderCollapsedXPBars = (stat: string, value: StatItem) => (
    <CollapsedStatItem key={stat}>
      <CollapsedStatName>{stat}</CollapsedStatName>
      <CollapsedXPBarContainer>
        <XPBar $color="blue">
          <XPBarFill $progress={calculateXP(value.xp, value.maxXp)} $color="blue" />
          <XPText>XP: {value.xp}/{value.maxXp}</XPText>
        </XPBar>
        <XPBar $color="purple">
          <XPBarFill $progress={calculateXP(value.prestigeXp, value.prestigeMaxXp)} $color="purple" />
          <XPText>PXP: {value.prestigeXp}/{value.prestigeMaxXp}</XPText>
        </XPBar>
      </CollapsedXPBarContainer>
    </CollapsedStatItem>
  );

  const renderExpandedView = () => (
    <>
      <StatCategory>
        <CategoryTitle>Training</CategoryTitle>
        <StatGroup>
          <GroupTitle>School</GroupTitle>
          {Object.entries(character.training.school).map(([stat, value]) => renderXPBars(stat, value))}
        </StatGroup>
        <StatGroup>
          <GroupTitle>Work</GroupTitle>
          {Object.entries(character.training.work).map(([stat, value]) => renderXPBars(stat, value))}
        </StatGroup>
      </StatCategory>
      <StatCategory>
        <CategoryTitle>Play</CategoryTitle>
        <StatGroup>
          <GroupTitle>Type</GroupTitle>
          {Object.entries(character.play.type).map(([stat, value]) => renderXPBars(stat, value))}
        </StatGroup>
        <StatGroup>
          <GroupTitle>Subcategory</GroupTitle>
          {Object.entries(character.play.subcategory).map(([stat, value]) => renderXPBars(stat, value))}
        </StatGroup>
      </StatCategory>
      <StatCategory>
        <CategoryTitle>Compete</CategoryTitle>
        <StatGroup>
          <GroupTitle>Type</GroupTitle>
          {Object.entries(character.compete.type).map(([stat, value]) => renderXPBars(stat, value))}
        </StatGroup>
      </StatCategory>
    </>
  );

  const renderCollapsedView = () => {
    const activeSkills = [
      ...Object.entries(character.training.school).filter(([_, value]) => value.active),
      ...Object.entries(character.training.work).filter(([_, value]) => value.active),
      ...Object.entries(character.play.type).filter(([_, value]) => value.active),
      ...Object.entries(character.play.subcategory).filter(([_, value]) => value.active),
      ...Object.entries(character.compete.type).filter(([_, value]) => value.active),
    ];

    if (activeSkills.length === 0) {
      return <NoActiveSkillsMessage>No Active Skills</NoActiveSkillsMessage>;
    }

    return (
      <>
        {activeSkills.map(([stat, value]) => renderCollapsedXPBars(stat, value))}
      </>
    );
  };

  return (
    <HeaderContainer $expanded={expanded}>
      <ToggleButton onClick={toggleExpanded}>
        {expanded ? 'Collapse Skills' : 'Expand Skills'}
      </ToggleButton>
      <HeaderContent $expanded={expanded} $activeSkillCount={activeSkillCount}>
        {expanded ? renderExpandedView() : renderCollapsedView()}
      </HeaderContent>
    </HeaderContainer>
  );
};

export default Header;