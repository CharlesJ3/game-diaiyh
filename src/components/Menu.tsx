import React from 'react';
import styled from 'styled-components';

const MenuContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  padding: 1rem;
  background-color: #e0e0e0;
  border-top: 2px solid #ccc;
  width: 100%;
  box-sizing: border-box;
`;

const MenuItem = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  background-color: #4a90e2;
  color: white;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s, transform 0.1s;
  font-size: 1rem;

  &:hover {
    background-color: #357abd;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.5);
  }

  &:active {
    transform: scale(0.98);
    background-color: #2a5d8f;
  }
`;

interface MenuProps {
  onMenuItemClick: (item: string) => void;
}

const Menu: React.FC<MenuProps> = ({ onMenuItemClick }) => {
  const menuItems = ['Overview', 'Train', 'Play', 'Compete', 'Prestige', 'Settings', 'Help/Tutorial'];

  return (
    <MenuContainer>
      {menuItems.map((item) => (
        <MenuItem key={item} onClick={() => onMenuItemClick(item)}>
          {item}
        </MenuItem>
      ))}
    </MenuContainer>
  );
};

export default Menu;