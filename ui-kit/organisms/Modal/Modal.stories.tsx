import React, { useState } from 'react'
import { storiesOf } from '@storybook/react'
import { Button } from '@/ui-kit/atoms'
import { Modal } from './Modal'
import { ThemeProvider } from 'styled-components'
import { Theme } from '@/ui-kit'
import { action } from '@storybook/addon-actions'
import {
  withKnobs,
  text,
  // boolean, number
} from '@storybook/addon-knobs'
import styled from 'styled-components'

export default {
  title: 'Storybook Knobs',
  decorators: [withKnobs],
}

const ColumnContainer = styled('div')`
  display: flex;
  flex-direction: column;
  > div:not(:last-child) {
    margin-bottom: 10px;
  }
`
const Container = styled('div')`
  display: flex;
  > button:not(:last-child) {
    margin-right: 10px;
  }
`

const renderModal = ({
  size,
  modalTitle,
  modalSubtitle,
  renderBodyContent,
  renderFooterContent,
  buttonWidth,
  buttonLabel,
}) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [isModalOpened, setIsModalOpened] = useState<boolean>(false)
  const handleOpenModal = () => {
    action('open')
    setIsModalOpened(true)
  }
  const handleCloseModal = () => setIsModalOpened(false)

  return (
    <>
      <h2>
        <code>size=</code>
        {size}
      </h2>
      <Container>
        <Button typeName="blue" size="medium" width={buttonWidth} onClick={handleOpenModal}>
          {buttonLabel}
        </Button>
        {isModalOpened && (
          <Modal
            size={size}
            modalTitle={!!modalTitle ? modalTitle : buttonLabel}
            modalSubtitle={!!modalSubtitle ? modalTitle : 'Subtitle'}
            closeModal={handleCloseModal}
            renderBodyContent={renderBodyContent}
            renderFooterContent={renderFooterContent}
          />
        )}
      </Container>
    </>
  )
}

const modalPacks = () => {
  // const disabled = boolean('Responsive Button Disabled', false)
  const titleText = text('Modal Title text', '')
  const subtitleText = text('Modal Subtitle text', '')

  return (
    <ColumnContainer>
      {renderModal({
        size: 'small',
        modalTitle: titleText,
        modalSubtitle: subtitleText,
        renderBodyContent: () => <div>Body content</div>,
        renderFooterContent: () => <div>Footer content</div>,
        buttonWidth: 'narrow',
        buttonLabel: 'Small size',
      })}
      {renderModal({
        size: 'large',
        modalTitle: titleText,
        modalSubtitle: subtitleText,
        renderBodyContent: () => <div>Body content</div>,
        renderFooterContent: () => <div>Footer content</div>,
        buttonWidth: 'narrow',
        buttonLabel: 'Large size',
      })}
      {renderModal({
        size: 'large',
        modalTitle: titleText,
        modalSubtitle: subtitleText,
        renderBodyContent: () => (
          <div>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua. Pharetra massa massa ultricies mi. Sed elementum tempus egestas sed sed. Gravida cum
              sociis natoque penatibus et magnis dis parturient. Arcu non sodales neque sodales. Porttitor rhoncus dolor
              purus non enim. Sit amet risus nullam eget felis. Augue ut lectus arcu bibendum at varius vel pharetra. Ac
              tortor vitae purus faucibus ornare suspendisse. Mauris nunc congue nisi vitae. Faucibus ornare suspendisse
              sed nisi lacus sed viverra tellus in. Ipsum suspendisse ultrices gravida dictum fusce ut placerat orci. Ut
              faucibus pulvinar elementum integer enim neque volutpat ac tincidunt. Id diam maecenas ultricies mi eget
              mauris pharetra et. Pharetra pharetra massa massa ultricies mi.
            </p>
            <p>
              Eget duis at tellus at urna condimentum mattis. Volutpat lacus laoreet non curabitur gravida arcu ac
              tortor. Ut sem viverra aliquet eget. Est pellentesque elit ullamcorper dignissim cras tincidunt lobortis
              feugiat vivamus. Rhoncus dolor purus non enim praesent elementum facilisis leo vel. Justo nec ultrices dui
              sapien eget mi proin sed libero. Sit amet commodo nulla facilisi nullam vehicula ipsum. Pellentesque
              habitant morbi tristique senectus et netus. Orci eu lobortis elementum nibh tellus molestie nunc non
              blandit. Lectus quam id leo in vitae turpis. Integer eget aliquet nibh praesent tristique magna sit.
              Pharetra massa massa ultricies mi. Morbi enim nunc faucibus a. Eu consequat ac felis donec et odio
              pellentesque. Neque convallis a cras semper auctor neque vitae tempus quam. Id leo in vitae turpis massa
              sed elementum tempus.
            </p>
            <p>
              Dui sapien eget mi proin sed libero enim sed faucibus. Lorem mollis aliquam ut porttitor. Gravida rutrum
              quisque non tellus orci ac. Ultricies mi quis hendrerit dolor magna eget. Malesuada bibendum arcu vitae
              elementum curabitur vitae. Auctor urna nunc id cursus metus. Pellentesque id nibh tortor id. Condimentum
              vitae sapien pellentesque habitant morbi tristique senectus et. Pellentesque elit eget gravida cum sociis
              natoque penatibus et. Tristique senectus et netus et malesuada fames ac. Id neque aliquam vestibulum morbi
              blandit cursus risus. Volutpat blandit aliquam etiam erat velit scelerisque in dictum non. Laoreet non
              curabitur gravida arcu ac.
            </p>
          </div>
        ),
        renderFooterContent: () => <div>Footer content</div>,
        buttonWidth: 'wide',
        buttonLabel: 'Large size & big body content',
      })}
    </ColumnContainer>
  )
}

storiesOf('organisms', module).add('Modal', () => {
  return <ThemeProvider theme={Theme}>{modalPacks()}</ThemeProvider>
})
