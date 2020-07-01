import React from 'react'
import { ModalFooterContainer } from './components/ModalFooterContainer'
import { ModalFooterDivider } from './components/ModalFooterDivider'

interface IProps {
  children: React.Component
}

export const ModalFooter = ({ children }: IProps) => (
  <ModalFooterContainer>
    <ModalFooterDivider />
    {children}
  </ModalFooterContainer>
)
