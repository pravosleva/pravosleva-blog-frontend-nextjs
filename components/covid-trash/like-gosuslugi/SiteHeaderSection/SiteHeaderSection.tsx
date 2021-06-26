import React from 'react'
import styled from 'styled-components'

const Wrapper = styled('div')`
  padding: 24px;
  display: flex;
  justify-content: space-between;

  & > .logo {
    width: 126px;
    height: 24px;
    background: url(/static/img/covid-trash/gosuslugi-logo.svg) 0 100% no-repeat;
    background-size: contain;
    text-indent: 100%;
  }

  & > .translate-button {
    display: flex;
    flex-direction: row;
    align-items: center;

    & > img {
      margin: 0 8px 0 0;
    }
  }
`

export const SiteHeaderSection = () => {
  return (
    <Wrapper>
      <div className='logo' />
      <div className='translate-button'>
        <img alt='img' src='/static/img/covid-trash/gosuslugi-lang-rus.svg' />
        <div>RUS</div>
      </div>
    </Wrapper>
  )
}
