import React from 'react';
import styled from 'styled-components';

const HelpTutorialContainer = styled.div`
  width: 100%;
  height: 100%;
  border: 2px solid #333;
  border-radius: 8px;
  background-color: #f0f0f0;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  color: #666;
`;

const HelpTutorial: React.FC = () => {
  return (
    <HelpTutorialContainer>
      Help/Tutorial Area
    </HelpTutorialContainer>
  );
};

export default HelpTutorial;
