import React, { useState } from 'react';
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

  const [activeComponent, setActiveComponent] = useState('Train');

  const handleMenuItemClick = (item: string) => {
    setActiveComponent(item);
  };

  const renderActiveComponent = () => {
    switch (activeComponent) {
      case 'Train':
        return <Train />;
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
        return <Train />;
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