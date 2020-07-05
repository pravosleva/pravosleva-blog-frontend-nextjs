import styled, { css } from 'styled-components'

interface IProps {
  isCurrentSelection: boolean
}

export const LangLink = styled('a')`
  color: gray;
  ${(p: IProps) =>
    p.isCurrentSelection &&
    css`
      color: #ff781e !important;
    `};
`
