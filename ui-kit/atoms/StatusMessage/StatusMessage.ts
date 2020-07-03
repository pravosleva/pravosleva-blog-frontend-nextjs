import styled, { css } from 'styled-components'
import { themeColor, themeTextStyle } from '@/ui-kit'

const typeColors = {
  error: css`
    color: ${themeColor('Incorrect')};
  `,
  success: css`
    color: ${themeColor('Succes')};
  `,
  info: css`
    color: ${themeColor('Dark Black')};
  `,
}

const getTypeColors = (type: string) => typeColors[type]

interface IProps {
  messageType: string
}

export const StatusMessage = styled('div')`
  display: flex;
  margin-top: 5px;
  ${themeTextStyle('12R Notifications')}
  ${(p: IProps) => getTypeColors(p.messageType)}
`
