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
  align-items: center;
  border-bottom: 1px solid #ccc;
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

const Play: React.FC = () => {
  return (
    <PlayContainer>
      <TopArea>Top Area</TopArea>
      <MiddleArea>Middle Area</MiddleArea>
      <BottomArea>
        <BottomLeftArea>Bottom Left</BottomLeftArea>
        <BottomRightArea>Bottom Right</BottomRightArea>
      </BottomArea>
    </PlayContainer>
  );
};

export default Play;