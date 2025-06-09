import styled from 'styled-components';

export const PopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

export const PopupContent = styled.div`
  background-color: #2b2c2f;
  padding: 40px;
  border-radius: 12px;
  border: 2px solid #19c37d;
  text-align: center;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
`;

export const PopupTitle = styled.h2`
  color: #19c37d;
  font-size: 28px;
  margin: 0 0 16px 0;
  font-weight: bold;
`;

export const PopupMessage = styled.p`
  color: #fff;
  font-size: 16px;
  line-height: 1.5;
  margin: 0 0 24px 0;
`;

export const PopupButton = styled.button`
  background-color: #19c37d;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #15a067;
  }
`; 