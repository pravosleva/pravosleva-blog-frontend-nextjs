import * as React from 'react'
import { storiesOf } from '@storybook/react'
import { Button, TType, TSize } from './Button'
import styled, { ThemeProvider } from 'styled-components'
import { Theme } from '@/ui-kit'
import { action } from '@storybook/addon-actions'
import { withKnobs, text, boolean } from '@storybook/addon-knobs' // number

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
interface IProps {
  typeName: TType
  size: TSize
  disabled: boolean
  label?: string
}
const renderButtonPack = ({ typeName, size, disabled, label }: IProps) => (
  <>
    <h2>
      <code>typeName=</code>
      {typeName} <code>size=</code>
      {size}
    </h2>
    <Container>
      <Button typeName={typeName} size={size} width="narrow" onClick={action('clicked')}>
        width=narrow
      </Button>
      <Button typeName={typeName} size={size} width="medium" onClick={action('clicked')}>
        width=medium
      </Button>
      <Button typeName={typeName} size={size} width="wide" onClick={action('clicked')}>
        width=wide
      </Button>
      <Button typeName={typeName} size={size} width="responsive" onClick={action('clicked')} disabled={disabled}>
        {!!label ? label : 'width=responsive'}
      </Button>
    </Container>
  </>
)

const buttonPacks = () => {
  const disabled = boolean('Responsive Button Disabled', false)
  const label = text('Responsive Button Label', '')

  return (
    <ColumnContainer>
      {renderButtonPack({
        typeName: 'blue',
        size: 'xsmall',
        disabled,
        label,
      })}
      {renderButtonPack({ typeName: 'orange', size: 'xsmall', disabled, label })}
      {renderButtonPack({ typeName: 'secondary', size: 'xsmall', disabled, label })}
      {renderButtonPack({ typeName: 'blue', size: 'small', disabled, label })}
      {renderButtonPack({ typeName: 'blue', size: 'medium', disabled, label })}
      {renderButtonPack({ typeName: 'blue', size: 'large', disabled, label })}
    </ColumnContainer>
  )
}

storiesOf('atoms', module).add('Button', () => {
  return <ThemeProvider theme={Theme}>{buttonPacks()}</ThemeProvider>
})
