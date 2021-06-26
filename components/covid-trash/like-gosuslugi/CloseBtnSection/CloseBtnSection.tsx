import React from 'react'
import styled from 'styled-components'

const Wrapper = styled('div')`
  margin-top: 24px;
`
const Link = styled('a')`
  background-color: #fff;
  border: 2px solid #0d4cd3;
  color: #0d4cd3;
  &:hover {
    color: #0d4cd3;
  }
  text-decoration: none;

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
  width: 100%;
`

export const CloseBtnSection = () => {
  return (
    <Wrapper>
      <Link href='https://www.gosuslugi.ru/'>Закрыть</Link>
    </Wrapper>
  )
}