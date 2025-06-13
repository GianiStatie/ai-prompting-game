import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fallAnimation = keyframes`
  0% {
    transform: translateY(-100vh) rotateZ(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) rotateZ(360deg);
    opacity: 0;
  }
`;

const ConfettiPiece = styled.div<{ $delay: number; $duration: number; $left: number; $color: string }>`
  position: fixed;
  top: -10px;
  left: ${props => props.$left}%;
  width: 10px;
  height: 10px;
  background-color: ${props => props.$color};
  animation: ${fallAnimation} ${props => props.$duration}s linear ${props => props.$delay}s infinite;
  z-index: 9999;
  border-radius: 2px;
`;

const ConfettiContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 9999;
`;

interface ConfettiProps {
  active: boolean;
  duration?: number;
}

export const Confetti: React.FC<ConfettiProps> = ({ active, duration = 4000 }) => {
  const [pieces, setPieces] = useState<Array<{
    id: number;
    delay: number;
    duration: number;
    left: number;
    color: string;
  }>>([]);

  const colors = ['#19c37d', '#ffd700', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3'];

  useEffect(() => {
    if (active) {
      const newPieces = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        delay: 0,
        duration: 2 + Math.random() * 3,
        left: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)]
      }));
      setPieces(newPieces);

      // Clear confetti after duration
      const timer = setTimeout(() => {
        setPieces([]);
      }, duration);

      return () => clearTimeout(timer);
    } else {
      setPieces([]);
    }
  }, [active, duration]);

  if (!active) return null;

  return (
    <ConfettiContainer>
      {pieces.map(piece => (
        <ConfettiPiece
          key={piece.id}
          $delay={piece.delay}
          $duration={piece.duration}
          $left={piece.left}
          $color={piece.color}
        />
      ))}
    </ConfettiContainer>
  );
}; 