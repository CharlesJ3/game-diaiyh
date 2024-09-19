import React from 'react';
import styled from 'styled-components';

interface StatItem {
  xp: number;
  maxXp: number;
  level: number;
  prestigeXp: number;
  prestigeMaxXp: number;
  prestigeLevel: number;
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

const HeaderContainer = styled.header`
  background-color: #1f2937;
  color: white;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  border-bottom: 2px solid #4b5563;
`;

const StatContainer = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-top: 0.5rem;
`;

const StatCategory = styled.div`
  flex: 1;
`;

const CategoryTitle = styled.h2`
  font-weight: bold;
  text-transform: capitalize;
  margin-bottom: 0.5rem;
  color: #fde68a;
`;

const StatGroup = styled.div`
  background-color: #374151;
  border-radius: 0.5rem;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
`;

const GroupTitle = styled.h3`
  font-weight: bold;
  margin-bottom: 0.25rem;
  color: #d1d5db;
`;

const StatItem = styled.div`
  margin-left: 0.5rem;
  font-size: 0.9rem;
`;

const StatName = styled.span`
  color: #9ca3af;
`;

const GameTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  color: #fde68a;
  align-self: center;
`;

const Header: React.FC<HeaderProps> = ({ character }) => {
  return (
    <HeaderContainer>
      <GameTitle>DEATH IS ALL IN YOUR HEAD IDLE</GameTitle>
      <StatContainer>
        <StatCategory>
          <CategoryTitle>Training</CategoryTitle>
          <StatGroup>
            <GroupTitle>School</GroupTitle>
            {Object.entries(character.training.school).map(([stat, value]) => (
              <StatItem key={stat}>
                <StatName>{stat}:</StatName> {value.level}
              </StatItem>
            ))}
          </StatGroup>
          <StatGroup>
            <GroupTitle>Work</GroupTitle>
            {Object.entries(character.training.work).map(([stat, value]) => (
              <StatItem key={stat}>
                <StatName>{stat}:</StatName> {value.level}
              </StatItem>
            ))}
          </StatGroup>
        </StatCategory>
        <StatCategory>
          <CategoryTitle>Play</CategoryTitle>
          <StatGroup>
            <GroupTitle>Type</GroupTitle>
            {Object.entries(character.play.type).map(([stat, value]) => (
              <StatItem key={stat}>
                <StatName>{stat}:</StatName> {value.level}
              </StatItem>
            ))}
          </StatGroup>
          <StatGroup>
            <GroupTitle>Subcategory</GroupTitle>
            {Object.entries(character.play.subcategory).map(([stat, value]) => (
              <StatItem key={stat}>
                <StatName>{stat}:</StatName> {value.level}
              </StatItem>
            ))}
          </StatGroup>
        </StatCategory>
        <StatCategory>
          <CategoryTitle>Compete</CategoryTitle>
          <StatGroup>
            <GroupTitle>Type</GroupTitle>
            {Object.entries(character.compete.type).map(([stat, value]) => (
              <StatItem key={stat}>
                <StatName>{stat}:</StatName> {value.level}
              </StatItem>
            ))}
          </StatGroup>
        </StatCategory>
      </StatContainer>
    </HeaderContainer>
  );
};

export default Header;