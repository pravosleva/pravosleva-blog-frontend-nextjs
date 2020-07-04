import styled, { css } from 'styled-components'
import { themeMediaQuery, themeShadow } from '@/ui-kit'

const sizes = {
  small: css`
    width: 440px;
    max-width: 440px;
  `,
  large: css`
    width: 800px;
    max-width: 800px;
  `,
}

interface ISize {
  size: 'small' | 'large'
}

const getSize = (size: string) => sizes[size]

export const ModalContent = styled('div')`
  display: flex;
  flex-direction: column;
  background: #FFF;
  color: #000;
  border-radius: 6px;
  padding: 0;
  margin: auto;
  ${(p: ISize) => getSize(p.size)}
  box-shadow: ${themeShadow('Main Shadow')};
  @media (max-width: ${themeMediaQuery('mobile', 'max')}) {
    border-radius: 0;
    margin: 0;
    width: 100%;
    max-width: 100%;
    height: 100vh;
    max-height: 100vh;
    justify-content: space-between;
  }
`
