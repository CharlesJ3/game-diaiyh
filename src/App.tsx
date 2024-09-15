import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { createGlobalStyle } from 'styled-components';
import Header from './components/Header';
import Menu from './components/Menu';
import Train from './components/Train';
import Play from './components/Play';
import Compete from './components/Compete';
import Prestige from './components/Prestige';
import Settings from './components/Settings';
import HelpTutorial from './components/HelpTutorial';
import MainArea from './components/MainArea';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: Arial, sans-serif;
  }
`;

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const HeaderSection = styled.section`
  flex: 1;
`;

const MainSection = styled.section`
  flex: 5;
  display: flex;
  padding: .5rem;
  overflow: auto;
`;

const MenuSection = styled.section`
  flex: 1;
  display: flex;
  align-items: center;
`;

interface CurrencyItem {
  amount: number;
  name: string;
  active: boolean;
}

interface Currencies {
  time: CurrencyItem[];
  money: CurrencyItem[];
  training: CurrencyItem[];
}

interface TrainingCategory {
  school: 'elementary' | 'middle' | 'high' | 'college' | 'learnFromGhosts';
  work: 'intern' | 'beginner' | 'intermediate' | 'expert' | 'master' | '10x';
}

interface TrainingItem {
  title: string;
  level: number;
  category: TrainingCategory;
  xp: number;
  currentLevel: number;
  maxXp: number;
  active: boolean;
  unlocked: boolean;
  unlockHow: string;
  xpGain: number;
  speed: number;
  currentSpeed: number;
  trainingPointsRequired: number;
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
}

const App: React.FC = () => {
  const [currencies, setCurrencies] = useState<Currencies>({
    time: [{ amount: 0, name: "Time", active: true }],
    money: [
      { amount: 0, name: "Cash", active: true },
      { amount: 0, name: "Gems", active: true }
    ],
    training: [
      { amount: 0, name: "Fighting", active: true },
      { amount: 0, name: "Working", active: true }
    ]
  });

  const [activeComponent, setActiveComponent] = useState('');

  const [training, setTraining] = useState<TrainingItem[]>([
    {
      title: "Basic Training",
      level: 1,
      category: { school: "elementary", work: "intern" },
      xp: 0,
      currentLevel: 1,
      maxXp: 10,
      active: false,
      unlocked: true,
      unlockHow: "Boss 1",
      xpGain: 1,
      speed: 1000,
      currentSpeed: 0,
      trainingPointsRequired: 1
    },
    {
      title: "Strength Training",
      level: 1,
      category: { school: "elementary", work: "intern" },
      xp: 0,
      currentLevel: 1,
      maxXp: 15,
      active: false,
      unlocked: true,
      unlockHow: "Boss 1",
      xpGain: 1,
      speed: 2000,
      currentSpeed: 0,
      trainingPointsRequired: 2
    },
    {
      title: "Endurance Running",
      level: 1,
      category: { school: "middle", work: "beginner" },
      xp: 0,
      currentLevel: 1,
      maxXp: 20,
      active: false,
      unlocked: false,
      unlockHow: "Boss 1",
      xpGain: 1,
      speed: 3000,
      currentSpeed: 0,
      trainingPointsRequired: 3
    },
  ]);

  const [character, setCharacter] = useState<Character>({
    name: "Player",
    title: "Novice",
    overallXp: 0,
    overallLevel: 1,
    overallMaxXp: 100,
    trainingOverallXp: 0,
    trainingOverallLevel: 1,
    trainingMaxXp: 50,
    trainingSpeed: 1,
    overallTrainingPoints: 2,
    activeTrainingPoints: 0
  });

  const animationFrameRef = useRef<number>();

  const handleMenuItemClick = (item: string) => {
    setActiveComponent(item);
  };

  const toggleTrainingActive = (index: number) => {
    setTraining(prevTraining => {
      const updatedTraining = [...prevTraining];
      const item = updatedTraining[index];
      const newActiveState = !item.active;
      let newActiveTrainingPoints = character.activeTrainingPoints;
      // Check if activating and if there are enough training points
      if (newActiveState) {
        newActiveTrainingPoints += item.trainingPointsRequired;
      } else {
        newActiveTrainingPoints -= item.trainingPointsRequired;
      }

      if (newActiveTrainingPoints <= character.overallTrainingPoints) {

        updatedTraining[index] = {
          ...item,
          active: newActiveState
        };
        setCharacter(prevCharacter => ({
          ...prevCharacter,
          activeTrainingPoints: newActiveTrainingPoints
        }));

        return updatedTraining;
      }

      return prevTraining; // Return the original state if we can't activate
    });
  };

  const updateGame = (timestamp: number) => {
    setTraining(prevTraining => {
      return prevTraining.map(item => {
        if (item.active) {
          const newCurrentSpeed = item.currentSpeed + 16.67;
          if (newCurrentSpeed >= item.speed) {
            const newXp = item.xp + item.xpGain;
            if (newXp >= item.maxXp) {
              return {
                ...item,
                currentLevel: item.currentLevel + 1,
                xp: newXp - item.maxXp,
                maxXp: Math.floor(item.maxXp * 1.1),
                currentSpeed: 0
              };
            } else {
              return {
                ...item,
                xp: newXp,
                currentSpeed: 0
              };
            }
          } else {
            return {
              ...item,
              currentSpeed: newCurrentSpeed
            };
          }
        }
        return item;
      });
    });

    setCharacter(prevCharacter => {
      const activeTrainings = training.filter(item => item.active && item.currentSpeed === 0);
      const totalXpGain = activeTrainings.reduce((sum, item) => sum + item.xpGain, 0);
      const newTrainingXp = prevCharacter.trainingOverallXp + totalXpGain;

      if (newTrainingXp >= prevCharacter.trainingMaxXp) {
        return {
          ...prevCharacter,
          trainingOverallLevel: prevCharacter.trainingOverallLevel + 1,
          trainingOverallXp: newTrainingXp - prevCharacter.trainingMaxXp,
          trainingMaxXp: Math.floor(prevCharacter.trainingMaxXp * 1.1)
        };
      } else {
        return {
          ...prevCharacter,
          trainingOverallXp: newTrainingXp
        };
      }
    });

    animationFrameRef.current = requestAnimationFrame(updateGame);
  };

  useEffect(() => {
    animationFrameRef.current = requestAnimationFrame(updateGame);
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const renderActiveComponent = () => {
    switch (activeComponent) {
      case 'Overview':
        return <MainArea
          training={training}
          setTraining={setTraining}
          character={character}
          setCharacter={setCharacter}
          toggleTrainingActive={toggleTrainingActive}
        />;
      case 'Train':
        return <Train
          training={training}
          setTraining={setTraining}
          character={character}
          setCharacter={setCharacter}
          toggleTrainingActive={toggleTrainingActive}
        />;
      case 'Play':
        return <Play />;
      case 'Compete':
        return <Compete />;
      case 'Prestige':
        return <Prestige />;
      case 'Settings':
        return <Settings />;
      case 'Help/Tutorial':
        return <HelpTutorial />;
      default:
        return <MainArea
          character={character}
          training={training}
          setCharacter={setCharacter}
          setTraining={setTraining}
          toggleTrainingActive={toggleTrainingActive}
        />;
    }
  };

  return (
    <>
      <GlobalStyle />
      <AppContainer>
        <HeaderSection>
          <Header title="Idle Game - Temp Title" currencies={currencies} />
        </HeaderSection>
        <MainSection>
          {renderActiveComponent()}
        </MainSection>
        <MenuSection>
          <Menu onMenuItemClick={handleMenuItemClick} />
        </MenuSection>
      </AppContainer>
    </>
  );
};

export default App;