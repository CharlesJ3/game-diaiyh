import React from 'react';
import styled from 'styled-components';

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

interface HeaderProps {
  title: string;
  currencies: Currencies;
}

const HeaderContainer = styled.header`
  background-color: #1f2937;
  color: white;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid #4b5563;
`;

const CurrencyContainer = styled.div`
  display: flex;
  gap: 1.5rem;
`;

const CurrencyCategory = styled.div`
  background-color: #374151;
  border-radius: 0.5rem;
  padding: 0.5rem;
`;

const CategoryTitle = styled.span`
  font-weight: bold;
  text-transform: capitalize;
`;

const CurrencyItem = styled.span`
  margin-left: 0.5rem;
`;

const CurrencyName = styled.span`
  color: #d1d5db;
`;

const GameTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  color: #fde68a;
`;

const Header: React.FC<HeaderProps> = ({ title, currencies }) => {
  return (
    <HeaderContainer>
      <CurrencyContainer>
        {Object.entries(currencies).map(([category, items]) => (
          <CurrencyCategory key={category}>
            <CategoryTitle>{category}:</CategoryTitle>
            {items.map((item, index) => (
              item.active && (
                <CurrencyItem key={index}>
                  <CurrencyName>{item.name}:</CurrencyName> {item.amount}
                </CurrencyItem>
              )
            ))}
          </CurrencyCategory>
        ))}
      </CurrencyContainer>
      <GameTitle>{title}</GameTitle>
    </HeaderContainer>
  );
};

export default Header;