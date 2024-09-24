import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Board = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 5px;
  margin-bottom: 20px;
`;

const Cell = styled.button`
  width: 80px;
  height: 80px;
  font-size: 2em;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  cursor: pointer;

  &:hover {
    background-color: #e0e0e0;
  }
`;

const Message = styled.p`
  font-size: 1.2em;
  margin-bottom: 20px;
`;

interface TicTacToeProps {
  onGameEnd: (won: boolean) => void;
}

const TicTacToe: React.FC<TicTacToeProps> = ({ onGameEnd }) => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState("Your turn");

  const checkWinner = (cells: (string | null)[]) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let line of lines) {
      const [a, b, c] = line;
      if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
        return cells[a];
      }
    }

    return null;
  };

  const isBoardFull = (cells: (string | null)[]) => {
    return cells.every((cell) => cell !== null);
  };

  const handleClick = (index: number) => {
    if (board[index] || !isPlayerTurn || gameOver) return;

    const newBoard = [...board];
    newBoard[index] = 'X';
    setBoard(newBoard);
    setIsPlayerTurn(false);

    const winner = checkWinner(newBoard);
    if (winner) {
      setGameOver(true);
      setMessage("You win!");
      onGameEnd(true);
    } else if (isBoardFull(newBoard)) {
      setGameOver(true);
      setMessage("It's a draw!");
      onGameEnd(false);
    } else {
      setMessage("Computer's turn");
    }
  };

  const computerMove = () => {
    const emptyCells = board.reduce((acc: number[], cell, index) => {
      if (cell === null) acc.push(index);
      return acc;
    }, []);

    const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const newBoard = [...board];
    newBoard[randomIndex] = 'O';
    setBoard(newBoard);
    setIsPlayerTurn(true);

    const winner = checkWinner(newBoard);
    if (winner) {
      setGameOver(true);
      setMessage("Computer wins!");
      onGameEnd(false);
    } else if (isBoardFull(newBoard)) {
      setGameOver(true);
      setMessage("It's a draw!");
      onGameEnd(false);
    } else {
      setMessage("Your turn");
    }
  };

  useEffect(() => {
    if (!isPlayerTurn && !gameOver) {
      const timer = setTimeout(computerMove, 1000);
      return () => clearTimeout(timer);
    }
  }, [isPlayerTurn, gameOver]);

  return (
    <GameContainer>
      <Message>{message}</Message>
      <Board>
        {board.map((cell, index) => (
          <Cell key={index} onClick={() => handleClick(index)}>
            {cell}
          </Cell>
        ))}
      </Board>
    </GameContainer>
  );
};

export default TicTacToe;