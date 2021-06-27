import React, { useCallback, useMemo } from 'react'
import styled from 'styled-components'
import { withTranslator } from '@/hocs/with-translator'

const Wrapper = styled('div')`
  padding: 30px 24px 30px 24px;
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
    cursor: pointer;
    user-select: none;

    & > img {
      margin: 0 8px 0 0;
    }
  }
`
interface IProps {
  t: (a: string) => string,
  setLang: (v: string) => void,
  suppoerLocales: { label: string, name: string, value: string, svgSrc: string, guLabel: string }[],
  currentLang: string,
}
const getLangData = (currentLang, suppoerLocales) => {
  let targetItem = suppoerLocales.find(({ value }) => currentLang === value)

  if (!targetItem) {
    targetItem = suppoerLocales[0]
  }

  return targetItem
}
const getNextLang = (currentLang, suppoerLocales) => {
  let targetIndex = suppoerLocales.findIndex(({ value }) => currentLang === value)

  if (targetIndex >= suppoerLocales.length - 1) {
    targetIndex = 0
  } else {
    targetIndex += 1
  }

  return targetIndex
}

export const SiteHeaderSectionConnected = ({
  // t,
  setLang,
  suppoerLocales,
  currentLang, // SAMPLE: 'en-US'
}: IProps) => {
  const handleChangeLang = useCallback(() => {
    setLang(suppoerLocales[getNextLang(currentLang, suppoerLocales)].value)
  }, [currentLang])
  const langData = useMemo(() => getLangData(currentLang, suppoerLocales), [currentLang])

  return (
    <Wrapper>
      <div className='logo' />
      <div className='translate-button' onClick={handleChangeLang}>
        <img alt='img' src={langData.svgSrc} />
        <div>{langData.guLabel}</div>
      </div>
    </Wrapper>
  )
}

export const SiteHeaderSection = withTranslator(SiteHeaderSectionConnected)