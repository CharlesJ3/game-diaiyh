import React from 'react';
import styled from 'styled-components';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import TicTacToe from './TicTacToe';

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

const PlayItemContainer = styled.div`
  display: flex;
  width: calc(33.33% - 10px);
  min-width: 200px;
`;

const PlayButton = styled.button`
  writing-mode: vertical-rl;
  text-orientation: upright;
  padding: 10px 5px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 8px 0 0 8px;
  cursor: pointer;
  font-size: 12px;
  letter-spacing: -1px;
  
  &:hover {
    background-color: #45a049;
  }
`;

const PlayItem = styled.div<{ $progress: number, $type: string, $subcategory: string }>`
  position: relative;
  background-color: ${props => getBackgroundColor(props.$type, props.$subcategory)};
  padding: 15px;
  border-radius: 0 8px 8px 0;
  border: 2px solid #ccc;
  border-left: none;
  transition: all 0.3s ease;
  overflow: hidden;
  cursor: pointer;
  width: 80%;
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
  padding: 10px;
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
  padding: 10px;
`;

const BottomRightArea = styled.div`
  flex: 2;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
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
  gameActive: boolean;
  gameType: string;
  gameMultiplier: number;
  gameMultiplierMax: number;
  gameMultiplierLevel: number;
}

interface PlayProps {
  play: PlayItem[];
  setPlay: React.Dispatch<React.SetStateAction<PlayItem[]>>;
  togglePlayActive: (index: number) => void;
  character: {
    play: {
      type: { [key: string]: { active: boolean; level: number } };
      subcategory: { [key: string]: { active: boolean; level: number } };
    };
  };
  calculateGameMultiplier: (baseMultiplier: number, level: number, maxMultiplier: number) => number;
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

const Play: React.FC<PlayProps> = ({ play, setPlay, togglePlayActive, character, calculateGameMultiplier }) => {
  const startGame = (index: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the click from propagating to the PlayItem
    setPlay(prevPlay => prevPlay.map((item, i) => ({
      ...item,
      gameActive: i === index,
      active: false // Ensure leveling up stops when game starts
    })));
  };

  const handlePlayItemClick = (index: number) => {
    setPlay(prevPlay => prevPlay.map((item, i) => {
      if (i === index) {
        return {
          ...item,
          active: !item.active,
          gameActive: false // Ensure game stops when toggling active state
        };
      }
      return {
        ...item,
        active: false // Deactivate other items
      };
    }));
  };

  const handleGameEnd = (index: number, won: boolean) => {
    setPlay(prevPlay => prevPlay.map((item, i) => {
      if (i === index) {
        const newGameMultiplierLevel = won ? Math.min(item.gameMultiplierLevel + 0.1, item.gameMultiplierMax - 1) : item.gameMultiplierLevel;
        return {
          ...item,
          gameActive: false,
          active: false,
          gameMultiplierLevel: newGameMultiplierLevel,
          gameMultiplier: calculateGameMultiplier(1.00, newGameMultiplierLevel, item.gameMultiplierMax)
        };
      }
      return item;
    }));
  };

  const combinedData = Object.entries(character.play.type).map(([typeName, typeData]) => ({
    name: typeName,
    type: typeData.level,
    subcategory: Math.max(...Object.values(character.play.subcategory).map(subData => subData.level))
  }));

  const activeGame = play.find(item => item.gameActive);

  return (
    <PlayContainer>
      <TopArea>
        <Wrapper>
          {play.map((item, index) => (
            <PlayItemContainer key={index}>
              <PlayButton onClick={(e) => startGame(index, e)}>
                PLAY
              </PlayButton>
              <PlayItem
                $progress={(item.xp / item.maxXp) * 100}
                $type={item.category.type}
                $subcategory={item.category.subcategory}
                onClick={() => handlePlayItemClick(index)}
              >
                <PlayContent>
                  <PlayTitle>{item.title}</PlayTitle>
                  <PlayInfo>Level: {item.currentLevel} | XP: {item.xp}/{item.maxXp}</PlayInfo>
                  <PlayInfo>
                    Type: {item.category.type} |
                    Subcategory: {item.category.subcategory}
                  </PlayInfo>
                  <PlayInfo>
                    Game Multiplier: {item.gameMultiplier.toFixed(2)}x
                  </PlayInfo>
                  <SpeedProgressBarContainer>
                    <SpeedProgressBar $progress={(item.currentSpeed / item.speed) * 100} />
                  </SpeedProgressBarContainer>
                </PlayContent>
              </PlayItem>
            </PlayItemContainer>
          ))}
        </Wrapper>
      </TopArea>
      <MiddleArea>
        {activeGame ? (
          activeGame.gameType === 'tictactoe' ? (
            <TicTacToe onGameEnd={(won) => handleGameEnd(play.indexOf(activeGame), won)} />
          ) : (
            <p>Game type not implemented: {activeGame.gameType}</p>
          )
        ) : (
          <p>Select a play activity and click PLAY to start a game!</p>
        )}
      </MiddleArea>
      <BottomArea>
        <BottomLeftArea>
          {/* This area is left empty for now */}
        </BottomLeftArea>
        <BottomRightArea>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={combinedData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="type" fill="#8884d8" name="Play Type Level" />
              <Bar dataKey="subcategory" fill="#82ca9d" name="Max Subcategory Level" />
            </BarChart>
          </ResponsiveContainer>
        </BottomRightArea>
      </BottomArea>
    </PlayContainer>
  );
};

export default Play;