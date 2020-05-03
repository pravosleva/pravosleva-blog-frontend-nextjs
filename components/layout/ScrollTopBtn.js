import styled, { css } from 'styled-components';

export const ScrollTopBtn = styled('div')`
  position: fixed;
  z-index: 3;
  right: 16px;
  bottom: 16px;
  background-color: #2E65B2;
  color: #fff;
  border-radius: 50%;
  border: none;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  // font-size: 30px;
  color: white;
  text-align: center;
  width: 56px;
  height: 56px;
  &:hover {
    opacity: 0.5;
  }
  outline: none;

  transform: translateX(100px);
  transition: all 0.5s ease-out;
  ${p => p.isShowed && css`
    transform: translateX(0px);
  `}
  display: flex;
  justify-content: center;
  align-items: center;
`;
