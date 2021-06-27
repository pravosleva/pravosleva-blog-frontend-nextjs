import React from 'react'
import styled from 'styled-components'

const Wrapper = styled('div')`
  box-sizing: border-box;

  width: 100%;
  padding: 22px 30px;
  background: url(/static/img/covid-trash/bg-valid.svg) no-repeat 0 0;
  border-radius: 16px;
  text-align: center;

  margin-bottom: 24px;
`
const H4 = styled('h4')`
  font-size: 18px;
  line-height: 24px;
  font-weight: 400;
  color: #fff;
  font-family: Lato-Bold,Arial,sans-serif !important;
`
const Activated = styled('div')`
  font-size: 14px;
  line-height: 20px;
  font-family: Lato,Arial,sans-serif,-apple-system;
  color: #0b1f33;

  margin-top: 24px;

  & > .target-text {
    display: inline-block;
    padding: 6px 36px;
    background: #fff;
    border-radius: 16px;
    vertical-align: baseline;
    color: #0b1f33;
    font-family: Lato-Bold,Arial,sans-serif,-apple-system !important;
    font-weight: 400;
  }
`

export const GreenCardSection = () => {
  return (
    <Wrapper>
      <H4>Сертификат профилактической прививки от COVID-19</H4>
      <Activated>
        <span className='target-text'>Действителен</span>
      </Activated>
    </Wrapper>
  )
}