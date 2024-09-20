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
import Notifications from './components/Notifications';
import SplashScreen from './components/SplashScreen';

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
  flex: 8;
  display: flex;
  padding: .5rem;
  overflow: hidden;
`;

const MenuSection = styled.section`
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

interface NotificationItem {
  id: number;
  message: string;
  type: 'tutorial' | 'normal' | 'important' | 'logging';
  active: boolean;
  notificationStartTimer: number;
  notificationEndTimer: number;
}

interface StatItem {
  xp: number;
  maxXp: number;
  level: number;
  prestigeXp: number;
  prestigeMaxXp: number;
  prestigeLevel: number;
  active: boolean;
}

const App: React.FC = () => {
  const [showSplashScreen, setShowSplashScreen] = useState(true);
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
      maxXp: 1,
      active: false,
      unlocked: true,
      unlockHow: "Boss 1",
      xpGain: 1,
      speed: 100,
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
    activeTrainingPoints: 0,
    trainingTalentPoints: 5,
    overallTrainingTalentPoints: 5,
    training: {
      school: {
        elementary: { xp: 0, maxXp: 100, level: 1, prestigeXp: 0, prestigeMaxXp: 1000, prestigeLevel: 0, active: true },
        middle: { xp: 0, maxXp: 100, level: 1, prestigeXp: 0, prestigeMaxXp: 1000, prestigeLevel: 0, active: false },
        high: { xp: 0, maxXp: 100, level: 1, prestigeXp: 0, prestigeMaxXp: 1000, prestigeLevel: 0, active: true },
        college: { xp: 0, maxXp: 100, level: 1, prestigeXp: 0, prestigeMaxXp: 1000, prestigeLevel: 0, active: false },
        learnFromGhosts: { xp: 0, maxXp: 100, level: 1, prestigeXp: 0, prestigeMaxXp: 1000, prestigeLevel: 0, active: false }
      },
      work: {
        intern: { xp: 0, maxXp: 100, level: 1, prestigeXp: 0, prestigeMaxXp: 1000, prestigeLevel: 0, active: false },
        beginner: { xp: 0, maxXp: 100, level: 1, prestigeXp: 0, prestigeMaxXp: 1000, prestigeLevel: 0, active: false },
        intermediate: { xp: 0, maxXp: 100, level: 1, prestigeXp: 0, prestigeMaxXp: 1000, prestigeLevel: 0, active: false },
        expert: { xp: 0, maxXp: 100, level: 1, prestigeXp: 0, prestigeMaxXp: 1000, prestigeLevel: 0, active: true },
        master: { xp: 0, maxXp: 100, level: 1, prestigeXp: 0, prestigeMaxXp: 1000, prestigeLevel: 0, active: false },
        '10x': { xp: 0, maxXp: 100, level: 1, prestigeXp: 0, prestigeMaxXp: 1000, prestigeLevel: 0, active: true }
      }
    },
    play: {
      type: {
        gaming: { xp: 0, maxXp: 100, level: 1, prestigeXp: 0, prestigeMaxXp: 1000, prestigeLevel: 0, active: false },
        'physical sports': { xp: 0, maxXp: 100, level: 1, prestigeXp: 0, prestigeMaxXp: 1000, prestigeLevel: 0, active: false },
        'mental sport': { xp: 0, maxXp: 100, level: 1, prestigeXp: 0, prestigeMaxXp: 1000, prestigeLevel: 0, active: false },
        relaxing: { xp: 0, maxXp: 100, level: 1, prestigeXp: 0, prestigeMaxXp: 1000, prestigeLevel: 0, active: true },
        extreme: { xp: 0, maxXp: 100, level: 1, prestigeXp: 0, prestigeMaxXp: 1000, prestigeLevel: 0, active: false }
      },
      subcategory: {
        fighting: { xp: 0, maxXp: 100, level: 1, prestigeXp: 0, prestigeMaxXp: 1000, prestigeLevel: 0, active: false },
        racing: { xp: 0, maxXp: 100, level: 1, prestigeXp: 0, prestigeMaxXp: 1000, prestigeLevel: 0, active: true },
        puzzle: { xp: 0, maxXp: 100, level: 1, prestigeXp: 0, prestigeMaxXp: 1000, prestigeLevel: 0, active: false },
        strategy: { xp: 0, maxXp: 100, level: 1, prestigeXp: 0, prestigeMaxXp: 1000, prestigeLevel: 0, active: false },
        card: { xp: 0, maxXp: 100, level: 1, prestigeXp: 0, prestigeMaxXp: 1000, prestigeLevel: 0, active: false },
        board: { xp: 0, maxXp: 100, level: 1, prestigeXp: 0, prestigeMaxXp: 1000, prestigeLevel: 0, active: false },
        team: { xp: 0, maxXp: 100, level: 1, prestigeXp: 0, prestigeMaxXp: 1000, prestigeLevel: 0, active: true },
        solo: { xp: 0, maxXp: 100, level: 1, prestigeXp: 0, prestigeMaxXp: 1000, prestigeLevel: 0, active: false },
        endurance: { xp: 0, maxXp: 100, level: 1, prestigeXp: 0, prestigeMaxXp: 1000, prestigeLevel: 0, active: false }
      }
    },
    compete: {
      type: {
        placeholderValue1: { xp: 0, maxXp: 100, level: 1, prestigeXp: 0, prestigeMaxXp: 1000, prestigeLevel: 0, active: false },
        placeholderValue2: { xp: 0, maxXp: 100, level: 1, prestigeXp: 0, prestigeMaxXp: 1000, prestigeLevel: 0, active: false },
        placeholderValue3: { xp: 0, maxXp: 100, level: 1, prestigeXp: 0, prestigeMaxXp: 1000, prestigeLevel: 0, active: false }
      }
    }
  });


  const [play, setPlay] = useState<PlayItem[]>([
    {
      title: "Basic Play",
      level: 1,
      category: { type: "gaming", subcategory: "fighting" },
      xp: 0,
      currentLevel: 1,
      maxXp: 1,
      active: false,
      unlocked: true,
      unlockHow: "Boss 1",
      xpGain: 1,
      speed: 10000,
      currentSpeed: 0,
    },
    {
      title: "Advanced Play",
      level: 1,
      category: { type: "gaming", subcategory: "strategy" },
      xp: 0,
      currentLevel: 1,
      maxXp: 10,
      active: false,
      unlocked: true,
      unlockHow: "Boss 2",
      xpGain: 2,
      speed: 8000,
      currentSpeed: 0,
    },
    {
      title: "Extreme Sports",
      level: 1,
      category: { type: "physical sports", subcategory: "endurance" },
      xp: 0,
      currentLevel: 1,
      maxXp: 20,
      active: false,
      unlocked: false,
      unlockHow: "Boss 3",
      xpGain: 3,
      speed: 12000,
      currentSpeed: 0,
    },
    {
      title: "Puzzle Solving",
      level: 1,
      category: { type: "mental sport", subcategory: "puzzle" },
      xp: 0,
      currentLevel: 1,
      maxXp: 15,
      active: false,
      unlocked: true,
      unlockHow: "Boss 4",
      xpGain: 2,
      speed: 9000,
      currentSpeed: 0,
    },
    {
      title: "Team Sports",
      level: 1,
      category: { type: "physical sports", subcategory: "team" },
      xp: 0,
      currentLevel: 1,
      maxXp: 25,
      active: false,
      unlocked: false,
      unlockHow: "Boss 5",
      xpGain: 4,
      speed: 15000,
      currentSpeed: 0,
    },
    {
      title: "Solo Adventure",
      level: 1,
      category: { type: "extreme", subcategory: "solo" },
      xp: 0,
      currentLevel: 1,
      maxXp: 30,
      active: false,
      unlocked: false,
      unlockHow: "Boss 6",
      xpGain: 5,
      speed: 20000,
      currentSpeed: 0,
    },
    {
      title: "Relaxing Meditation",
      level: 1,
      category: { type: "relaxing", subcategory: "solo" },
      xp: 0,
      currentLevel: 1,
      maxXp: 5,
      active: false,
      unlocked: true,
      unlockHow: "Boss 7",
      xpGain: 1,
      speed: 5000,
      currentSpeed: 0,
    }
  ]);

  const handleCloseSplashScreen = () => {
    setShowSplashScreen(false);
  };

  // These are all temporary, I'm going to add in real training later but for now I need to test the UI
  const [trainingTalents, setTrainingTalents] = useState<TrainingTalent[]>([
    {
      id: 0,
      name: "Fast Learner",
      talentSkillCost: 1,
      description: "Increases XP gain from all training activities",
      currentLevel: 0,
      maxLevel: 5,
      perLevelMultiplier: 0.1,
      requiredTalentSkills: [],
      active: false,
      type: ['Strength']
    },
    {
      id: 1,
      name: "Endurance",
      talentSkillCost: 2,
      description: "Reduces training cooldown time",
      currentLevel: 0,
      maxLevel: 5,
      perLevelMultiplier: 0.05,
      requiredTalentSkills: [0],
      active: false,
      type: ['Strength']
    },
    {
      id: 2,
      name: "Multi-tasking",
      talentSkillCost: 3,
      description: "Increases the number of simultaneous training activities",
      currentLevel: 0,
      maxLevel: 5,
      perLevelMultiplier: 1,
      requiredTalentSkills: [1],
      active: false,
      type: ['Strength']
    },
    {
      id: 3,
      name: "Power Lifting",
      talentSkillCost: 2,
      description: "Increases strength gain from all activities",
      currentLevel: 0,
      maxLevel: 5,
      perLevelMultiplier: 0.15,
      requiredTalentSkills: [2],
      active: false,
      type: ['Strength']
    },
    {
      id: 4,
      name: "Mental Fortitude",
      talentSkillCost: 2,
      description: "Increases intellect gain from all activities",
      currentLevel: 0,
      maxLevel: 5,
      perLevelMultiplier: 0.15,
      requiredTalentSkills: [3],
      active: false,
      type: ['Strength']
    },
    {
      id: 5,
      name: "Quick Reflexes",
      talentSkillCost: 2,
      description: "Improves reaction time in all activities",
      currentLevel: 0,
      maxLevel: 5,
      perLevelMultiplier: 0.1,
      requiredTalentSkills: [4],
      active: false,
      type: ['Strength']
    },
    {
      id: 6,
      name: "Strategic Planning",
      talentSkillCost: 3,
      description: "Enhances efficiency of all training methods",
      currentLevel: 0,
      maxLevel: 5,
      perLevelMultiplier: 0.2,
      requiredTalentSkills: [5],
      active: false,
      type: ['Strength']
    },
    {
      id: 7,
      name: "Agility Training",
      talentSkillCost: 2,
      description: "Improves speed gain from all activities",
      currentLevel: 0,
      maxLevel: 5,
      perLevelMultiplier: 0.15,
      requiredTalentSkills: [],
      active: false,
      type: ['Intellect']
    },
    {
      id: 8,
      name: "Problem Solving",
      talentSkillCost: 3,
      description: "Enhances problem-solving abilities",
      currentLevel: 0,
      maxLevel: 5,
      perLevelMultiplier: 0.2,
      requiredTalentSkills: [7],
      active: false,
      type: ['Intellect']
    },
    {
      id: 9,
      name: "Creativity",
      talentSkillCost: 2,
      description: "Boosts creativity and innovation",
      currentLevel: 0,
      maxLevel: 5,
      perLevelMultiplier: 0.15,
      requiredTalentSkills: [8],
      active: false,
      type: ['Intellect']
    },
    {
      id: 10,
      name: "Leadership",
      talentSkillCost: 3,
      description: "Develops leadership skills",
      currentLevel: 0,
      maxLevel: 5,
      perLevelMultiplier: 0.2,
      requiredTalentSkills: [9],
      active: false,
      type: ['Intellect']
    },
    {
      id: 11,
      name: "Communication",
      talentSkillCost: 2,
      description: "Improves communication skills",
      currentLevel: 0,
      maxLevel: 5,
      perLevelMultiplier: 0.15,
      requiredTalentSkills: [10],
      active: false,
      type: ['Intellect']
    },
    {
      id: 12,
      name: "Time Management",
      talentSkillCost: 3,
      description: "Enhances time management abilities",
      currentLevel: 0,
      maxLevel: 5,
      perLevelMultiplier: 0.2,
      requiredTalentSkills: [11],
      active: false,
      type: ['Intellect']
    },
    {
      id: 13,
      name: "Critical Thinking",
      talentSkillCost: 2,
      description: "Improves critical thinking skills",
      currentLevel: 0,
      maxLevel: 5,
      perLevelMultiplier: 0.15,
      requiredTalentSkills: [12],
      active: false,
      type: ['Speed']
    },
    {
      id: 14,
      name: "Decision Making",
      talentSkillCost: 3,
      description: "Enhances decision-making abilities",
      currentLevel: 0,
      maxLevel: 5,
      perLevelMultiplier: 0.2,
      requiredTalentSkills: [13],
      active: false,
      type: ['Speed']
    },
    {
      id: 15,
      name: "Stress Management",
      talentSkillCost: 2,
      description: "Improves stress management skills",
      currentLevel: 0,
      maxLevel: 5,
      perLevelMultiplier: 0.15,
      requiredTalentSkills: [14],
      active: false,
      type: ['Speed']
    },
    {
      id: 16,
      name: "Teamwork",
      talentSkillCost: 3,
      description: "Develops teamwork skills",
      currentLevel: 0,
      maxLevel: 5,
      perLevelMultiplier: 0.2,
      requiredTalentSkills: [15],
      active: false,
      type: ['Speed']
    },
    {
      id: 17,
      name: "Adaptability",
      talentSkillCost: 2,
      description: "Improves adaptability to new situations",
      currentLevel: 0,
      maxLevel: 5,
      perLevelMultiplier: 0.15,
      requiredTalentSkills: [16],
      active: false,
      type: ['Speed']
    },
    {
      id: 18,
      name: "Emotional Intelligence",
      talentSkillCost: 3,
      description: "Develops emotional intelligence",
      currentLevel: 0,
      maxLevel: 5,
      perLevelMultiplier: 0.2,
      requiredTalentSkills: [17],
      active: false,
      type: ['Speed']
    },
    {
      id: 19,
      name: "Negotiation",
      talentSkillCost: 2,
      description: "Improves negotiation skills",
      currentLevel: 0,
      maxLevel: 5,
      perLevelMultiplier: 0.15,
      requiredTalentSkills: [0],
      active: false,
      type: ['Strength', 'Intellect']
    },
    {
      id: 20,
      name: "Networking",
      talentSkillCost: 3,
      description: "Develops networking skills",
      currentLevel: 0,
      maxLevel: 5,
      perLevelMultiplier: 0.2,
      requiredTalentSkills: [14, 8],
      active: false,
      type: ['Speed', 'Intellect']
    },
    {
      id: 21,
      name: "Problem Solving",
      talentSkillCost: 2,
      description: "Improves problem-solving abilities",
      currentLevel: 0,
      maxLevel: 5,
      perLevelMultiplier: 0.15,
      requiredTalentSkills: [15, 4],
      active: false,
      type: ['Intellect', 'Strength']
    },
    {
      id: 22,
      name: "Creativity",
      talentSkillCost: 3,
      description: "Boosts creativity and innovation",
      currentLevel: 0,
      maxLevel: 5,
      perLevelMultiplier: 0.2,
      requiredTalentSkills: [10, 18],
      active: false,
      type: ['Intellect', 'Speed']
    },
    {
      id: 23,
      name: "Leadership",
      talentSkillCost: 2,
      description: "Develops leadership skills",
      currentLevel: 0,
      maxLevel: 5,
      perLevelMultiplier: 0.15,
      requiredTalentSkills: [2, 14],
      active: false,
      type: ['Strength', 'Speed']
    },
    {
      id: 24,
      name: "Communication",
      talentSkillCost: 3,
      description: "Improves communication skills",
      currentLevel: 0,
      maxLevel: 5,
      perLevelMultiplier: 0.2,
      requiredTalentSkills: [8, 14],
      active: false,
      type: ['Intellect', 'Speed']
    },
    {
      id: 25,
      name: "Time Management",
      talentSkillCost: 2,
      description: "Enhances time management abilities",
      currentLevel: 0,
      maxLevel: 5,
      perLevelMultiplier: 0.15,
      requiredTalentSkills: [15, 2],
      active: false,
      type: ['Speed', 'Strength']
    }
  ]);

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [nextNotificationId, setNextNotificationId] = useState(0);
  const [notificationLog, setNotificationLog] = useState<NotificationItem[]>([]);
  const lastNotificationRef = useRef<{ message: string, timestamp: number } | null>(null);

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

  const togglePlayActive = (index: number) => {
    setPlay(prevPlay => {
      const updatedPlay = [...prevPlay];
      const item = updatedPlay[index];
      updatedPlay[index] = {
        ...item,
        active: !item.active,
        currentSpeed: 0 // Reset progress when toggling
      };
      return updatedPlay;
    });
  };

  const addTrainingTalentPoints = () => {
    setCharacter(prevCharacter => ({
      ...prevCharacter,
      trainingTalentPoints: prevCharacter.trainingTalentPoints + 1,
      overallTrainingTalentPoints: prevCharacter.overallTrainingTalentPoints + 1
    }));
  };

  const addNotification = (message: string, type: 'tutorial' | 'normal' | 'important' | 'logging' = 'normal') => {
    const now = Date.now();

    // Check if this is a duplicate notification within the last second
    if (lastNotificationRef.current &&
      lastNotificationRef.current.message === message &&
      now - lastNotificationRef.current.timestamp < 1000) {
      return; // Don't add duplicate notification
    }

    const newNotification: NotificationItem = {
      id: nextNotificationId,
      message,
      type,
      active: true,
      notificationStartTimer: 0,
      notificationEndTimer: 5000
    };

    setNextNotificationId(prevId => prevId + 1);

    setNotifications(prevNotifications => {
      let updatedNotifications: NotificationItem[];

      if (prevNotifications.length < 6) {
        updatedNotifications = [...prevNotifications, newNotification];
      } else {
        updatedNotifications = [...prevNotifications.slice(1), newNotification];
      }

      return updatedNotifications;
    });

    setNotificationLog(prevLog => {
      const updatedLog = [...prevLog, newNotification].slice(-100);
      return updatedLog;
    });

    // Update the last notification reference
    lastNotificationRef.current = { message, timestamp: now };
  };

  const removeNotification = (id: number) => {
    setNotifications(prevNotifications =>
      prevNotifications.filter(notification => notification.id !== id)
    );
  };

  const handleTrainingLevelUp = (trainingName: string, newLevel: number) => {
    addNotification(`${trainingName} increased to level ${newLevel}`, 'normal');
  };

  const updateGame = (timestamp: number) => {
    setTraining(prevTraining => {
      return prevTraining.map(item => {
        if (item.active) {
          const newCurrentSpeed = item.currentSpeed + 16.67;
          if (newCurrentSpeed >= item.speed) {
            const newXp = item.xp + item.xpGain;
            if (newXp >= item.maxXp) {
              addTrainingTalentPoints();
              handleTrainingLevelUp(item.title, item.currentLevel + 1);
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

    setPlay(prevPlay => {
      return prevPlay.map(item => {
        if (item.active) {
          const newCurrentSpeed = item.currentSpeed + 16.67; // Assuming 60 FPS
          if (newCurrentSpeed >= item.speed) {
            const newXp = item.xp + item.xpGain;
            if (newXp >= item.maxXp) {
              // Level up logic
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
        addTrainingTalentPoints();
        addNotification(`Overall training level increased to ${prevCharacter.trainingOverallLevel + 1}`, 'important');
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

    setNotifications(prevNotifications =>
      prevNotifications.map(notification => {
        if (notification.active) {
          const newStartTimer = notification.notificationStartTimer + 16.67; // Assuming 60 FPS
          if (newStartTimer >= notification.notificationEndTimer) {
            return { ...notification, active: false };
          }
          return { ...notification, notificationStartTimer: newStartTimer };
        }
        return notification;
      }).filter(notification => notification.active)
    );

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
          trainingTalents={trainingTalents}
          character={character}
          setCharacter={setCharacter}
          toggleTrainingActive={toggleTrainingActive}
          setTrainingTalents={setTrainingTalents}
        />;
      case 'Play':
        return <Play play={play} setPlay={setPlay} togglePlayActive={togglePlayActive} />;
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

  // if (showSplashScreen) {
  //   return <SplashScreen onClose={handleCloseSplashScreen} />;
  // }

  return (
    <>
      <GlobalStyle />
      <AppContainer>
        <HeaderSection>
          <Header character={character} />
        </HeaderSection>
        <MainSection>
          {renderActiveComponent()}
        </MainSection>
        <MenuSection>
          <Menu onMenuItemClick={handleMenuItemClick} />
        </MenuSection>
        <Notifications notifications={notifications} removeNotification={removeNotification} />
      </AppContainer>
    </>
  );
};

export default App;