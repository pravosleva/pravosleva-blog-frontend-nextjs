import React from 'react'
// import PropTypes from 'prop-types';
// import { themeColor } from '@/ui-kit/Theme';
import { Icon } from '@/ui-kit/atoms/Icon'
import { ModalHeaderContainer } from './components/ModalHeaderContainer'
import { ModalTitle } from './components/ModalTitle'
import { ModalSubtitle } from './components/ModalSubtitle'
import { ModalHeaderDivider } from './components/ModalHeaderDivider'
import { CloseButton } from './components/CloseButton'

export const ModalHeader = ({ modalTitle, modalSubtitle, closeModal }) => (
  <ModalHeaderContainer>
    <ModalTitle>{modalTitle}</ModalTitle>
    <ModalSubtitle>{modalSubtitle}</ModalSubtitle>
    <ModalHeaderDivider />
    <CloseButton onClick={closeModal}>
      <Icon name="x-close" sizeVariation="32px" defaultColor="Gray-blue" />
    </CloseButton>
  </ModalHeaderContainer>
)

// ModalHeader.propTypes = {
//   modalTitle: PropTypes.string.isRequired,
//   modalSubtitle: PropTypes.string.isRequired,
//   closeModal: PropTypes.func.isRequired,
// };
