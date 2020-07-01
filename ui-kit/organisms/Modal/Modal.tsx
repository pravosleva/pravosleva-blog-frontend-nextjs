import React from 'react'
import { ModalHeader } from './components/ModalHeader'
import { ModalFooter } from './components/ModalFooter'
import { ModalBody } from './components/ModalBody'
import { ModalContainer } from './components/ModalContainer'
import { ModalContent } from './components/ModalContent'

interface IProps {
  size: 'large' | 'small'
  modalTitle: string
  modalSubtitle: string
  closeModal: Function
  renderBodyContent: Function
  renderFooterContent: Function
}

export const Modal = ({
  size,
  modalTitle,
  modalSubtitle,
  closeModal,
  renderBodyContent,
  renderFooterContent,
}: IProps) => (
  <ModalContainer>
    <ModalContent size={size}>
      <ModalHeader modalTitle={modalTitle} modalSubtitle={modalSubtitle} closeModal={closeModal} />
      <ModalBody>{renderBodyContent()}</ModalBody>
      <ModalFooter>{renderFooterContent()}</ModalFooter>
    </ModalContent>
  </ModalContainer>
)
