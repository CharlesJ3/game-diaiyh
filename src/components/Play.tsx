import React from 'react';
import styled from 'styled-components';

const PlayContainer = styled.div`
  width: 100%;
  height: 100%;
  border: 2px solid #333;
  border-radius: 8px;
  background-color: #f0f0f0;
  display: flex;
  flex-direction: column;
  color: #666;
`;

const TopArea = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  border-bottom: 1px solid #ccc;
  padding: 10px;
  overflow-x: auto;
  overflow-y: hidden;
`;

const Wrapper = styled.div`
  display: flex;
  gap: 10px;
  width: 96%;
  max-height: 100%;
  overflow-y: hidden;
  overflow-x: auto;
`;

const PlayItem = styled.div<{ $active: boolean, $progress: number, $type: string, $subcategory: string }>`
  position: relative;
  background-color: ${props => getBackgroundColor(props.$type, props.$subcategory)};
  padding: 15px;
  border-radius: 8px;
  border: 2px solid ${props => props.$active ? '#4caf50' : '#ccc'};
  transition: all 0.3s ease;
  overflow: hidden;
  cursor: pointer;
  width: calc(33.33% - 10px);
  min-width: 200px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  margin-bottom: 10px;

  &:hover {
    box-shadow: 0 4px 8px rgba(0,0,0,0.15);
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

const PlayContent = styled.div`
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const PlayTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  color: #333;
`;

const PlayInfo = styled.p`
  margin: 0;
  font-size: 12px;
  color: #666;
`;

const SpeedProgressBarContainer = styled.div`
  width: 100%;
  height: 6px;
  background-color: #e0e0e0;
  border-radius: 3px;
  overflow: hidden;
  margin-top: 5px;
`;

const SpeedProgressBar = styled.div<{ $progress: number }>`
  height: 100%;
  width: ${props => props.$progress}%;
  background-color: #2196f3;
`;

const MiddleArea = styled.div`
  flex: 2;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const BottomArea = styled.div`
  flex: 1;
  display: flex;
  border-top: 1px solid #ccc;
`;

const BottomLeftArea = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  border-right: 1px solid #ccc;
`;

const BottomRightArea = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

interface PlayItem {
  title: string;
  level: number;
  category: {
    type: 'gaming' | 'physical sports' | 'mental sport' | 'relaxing' | 'extreme';
    subcategory: 'fighting' | 'racing' | 'puzzle' | 'strategy' | 'card' | 'board' | 'team' | 'solo' | 'endurance';
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
}

interface PlayProps {
  play: PlayItem[];
  setPlay: React.Dispatch<React.SetStateAction<PlayItem[]>>;
  togglePlayActive: (index: number) => void;
  character: {
    play: {
      type: { [key: string]: { active: boolean } };
      subcategory: { [key: string]: { active: boolean } };
    };
  };
}

const getBackgroundColor = (type: string, subcategory: string) => {
  const baseColors = {
    gaming: '#E6F3FF',
    'physical sports': '#E6FFE6',
    'mental sport': '#FFE6E6',
    relaxing: '#FFF0E6',
    extreme: '#F3E6FF'
  };

  const subcategoryShades = {
    fighting: '66',
    racing: '99',
    puzzle: 'CC',
    strategy: 'DD',
    card: 'EE',
    board: 'FF',
    team: '88',
    solo: 'AA',
    endurance: 'BB'
  };

  const baseColor = baseColors[type as keyof typeof baseColors] || '#F0F0F0';
  const shade = subcategoryShades[subcategory as keyof typeof subcategoryShades] || 'FF';

  return baseColor + shade;
};

const Play: React.FC<PlayProps> = ({ play, setPlay, togglePlayActive, character }) => {
  return (
    <PlayContainer>
      <TopArea>
        <Wrapper>
          {play.map((item, index) => (
            <PlayItem
              key={index}
              $active={item.active}
              $progress={(item.xp / item.maxXp) * 100}
              $type={item.category.type}
              $subcategory={item.category.subcategory}
              onClick={() => togglePlayActive(index)}
            >
              <PlayContent>
                <PlayTitle>{item.title}</PlayTitle>
                <PlayInfo>Level: {item.currentLevel} | XP: {item.xp}/{item.maxXp}</PlayInfo>
                <PlayInfo>
                  Type: {item.category.type}
                  ({character.play.type[item.category.type]?.active ? 'Active' : 'Inactive'}) |
                  Subcategory: {item.category.subcategory}
                  ({character.play.subcategory[item.category.subcategory]?.active ? 'Active' : 'Inactive'})
                </PlayInfo>
                <SpeedProgressBarContainer>
                  <SpeedProgressBar $progress={(item.currentSpeed / item.speed) * 100} />
                </SpeedProgressBarContainer>
              </PlayContent>
            </PlayItem>
          ))}
        </Wrapper>
      </TopArea>
      <MiddleArea>
        {/* You can add more details about selected play item here */}
      </MiddleArea>
      <BottomArea>
        <BottomLeftArea>{/* Add content for bottom left area */}</BottomLeftArea>
        <BottomRightArea>{/* Add content for bottom right area */}</BottomRightArea>
      </BottomArea>
    </PlayContainer>
  );
};

export default Play;