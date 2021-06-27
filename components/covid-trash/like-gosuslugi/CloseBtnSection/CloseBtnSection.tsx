import React from 'react'
import styled from 'styled-components'
import { withTranslator } from '@/hocs/with-translator'

const Wrapper = styled('div')`
  margin-top: 24px;
  width: 100%;

  display: flex;
  justify-content: center;;
`
const Link = styled('a')`
  background-color: #fff;
  border: 2px solid #0d4cd3;
  color: #0d4cd3;
  &:hover {
    color: #0d4cd3;
  }
  text-decoration: none;
  font-family: Lato,Arial,sans-serif,-apple-system !important;

  border-radius: 8px;
  cursor: pointer;
  display: inline-block;
  font-family: Lato,Arial,sans-serif;
  font-size: 16px;
  line-height: 24px;
  outline: none;
  padding: 12px 24px;
  text-align: center;
  white-space: nowrap;

  @media (min-width: 768px) {
    width: auto;
  }
  @media (max-width: 767px) {
    width: 100%;
  }
  
`

export const CloseBtnSectionConnected = ({ t }) => {
  return (
    <Wrapper>
      <Link href='https://www.gosuslugi.ru/'>{t('CLOSE')}</Link>
    </Wrapper>
  )
}

export const CloseBtnSection = withTranslator(CloseBtnSectionConnected)
