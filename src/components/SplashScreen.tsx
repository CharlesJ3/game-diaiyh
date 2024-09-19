import React from 'react';
import styled from 'styled-components';
import SplashScreenBG from '../assets/diaiyhi-main-logo.png';

const SplashScreenContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #000;
  color: #fff;
`;

const LogoContainer = styled.div`
  width: 80%;
  height: 0;
  padding-bottom: 45%;
  margin-bottom: 2rem;
  background-image: url(${SplashScreenBG});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1rem;
`;

const Subtitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 2rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  font-size: 1rem;
  background-color: #333;
  color: #fff;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #555;
  }
`;

interface SplashScreenProps {
  onClose: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onClose }) => {
  return (
    <SplashScreenContainer>
      <LogoContainer />
      <ButtonContainer>
        <Button onClick={onClose}>Play</Button>
        <Button onClick={onClose}>Load Online Save</Button>
        <Button onClick={onClose}>Load Local Save</Button>
      </ButtonContainer>
    </SplashScreenContainer>
  );
};

export default SplashScreen;