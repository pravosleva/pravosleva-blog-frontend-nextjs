import React, { useRef, useCallback } from 'react'
import styled from 'styled-components'
import { EquipmentGroup } from './components/EquipmentGroup'
// import { EquipmentSubgroup } from './components/EquipmentSubgroup'
import { Card } from './components/Card/index'
import { withTranslator } from '@/hocs/with-translator'

const Wrapper = styled('div')`
  display: flex;
  flex-direction: column;
  & > div:not(:last-child) {
    margin-bottom: 20px;
  }
  @media(max-width: 767px) {
    margin-bottom: 30px;
  }
`

export const HVACEquipment = withTranslator(({ t }) => {
  const unitRef1 = useRef(null)
  const unitRef11 = useRef(null)
  const unitRef12 = useRef(null)
  const unitRef13 = useRef(null)
  const unitRef14 = useRef(null)
  const unitRef2 = useRef(null)
  const unitRef21 = useRef(null)
  const unitRef22 = useRef(null)
  const unitRef23 = useRef(null)
  const unitRef24 = useRef(null)
  const unitRef3 = useRef(null)
  const unitRef31 = useRef(null)
  const unitRef32 = useRef(null)
  const unitRef4 = useRef(null)
  const unitRef41 = useRef(null)
  // const unitRef212 = useRef(null)
  // const unitRef22 = useRef(null)
  // const unitRef221 = useRef(null)
  const refs = useRef({
    unitRef1,
    unitRef11,
    unitRef12,
    unitRef13,
    unitRef14,
    unitRef2,
    unitRef21,
    unitRef22,
    unitRef23,
    unitRef24,
    unitRef3,
    unitRef31,
    unitRef32,
    unitRef4,
    unitRef41,
    // unitRef212,
    // unitRef22,
    // unitRef221,
  })

  const isCard = (refName) => refName.length === 9
  const inactiveAllCards = () => {
    Object.keys(refs.current).forEach((refName) => {
      // console.log(refs.current[refName])
      if (
        // isCard(refName) &&
        !!refs.current[refName].current
      ) {
        refs.current[refName].current.classList.remove('active-card')
      }
    })
  }

  const scrollToUnit = useCallback((ref, isCard) => {
    if(!!ref?.current && !!window) {
      window.scrollTo({
        behavior: "smooth",
        top: ref.current.offsetTop - 20
      })
      if (isCard) {
        inactiveAllCards()
        ref.current.classList.add('active-card')
      }
    }
  }, [])

  // useEffect(() => { scrollToUnit(refs.current['unitRef22']) }, [])
  const linkTo = useCallback((refName) => (e) => {
    e.preventDefault()
    scrollToUnit(refs.current[refName], isCard(refName))
  }, [])

  return (
    <>
      <ul>
        <li><a onClick={linkTo('unitRef1')}>{t('HVAC_1')}</a></li>
        <ul>
          <li><a onClick={linkTo('unitRef11')}>{t('HVAC_1.1')}</a></li>
          <li><a onClick={linkTo('unitRef12')}>{t('HVAC_1.2')}</a></li>
          <li><a onClick={linkTo('unitRef13')}>{t('HVAC_1.3')}</a></li>
          <li><a onClick={linkTo('unitRef14')}>{t('HVAC_1.4')}</a></li>
        </ul>
        <li><a onClick={linkTo('unitRef2')}>{t('HVAC_2')}</a></li>
        <ul>
          <li><a onClick={linkTo('unitRef21')}>{t('HVAC_2.1')}</a></li>
          <li><a onClick={linkTo('unitRef22')}>{t('HVAC_2.2')}</a></li>
          <li><a onClick={linkTo('unitRef23')}>{t('HVAC_2.3')}</a></li>
          <li><a onClick={linkTo('unitRef24')}>{t('HVAC_2.4')}</a></li>
        </ul>
        <li><a onClick={linkTo('unitRef3')}>{t('HVAC_3')}</a></li>
        <ul>
          <li><a onClick={linkTo('unitRef31')}>{t('HVAC_3.1')}</a></li>
          <li><a onClick={linkTo('unitRef32')}>{t('HVAC_3.2')}</a></li>
        </ul>
        <li><a onClick={linkTo('unitRef4')}>{t('HVAC_4')}</a></li>
        <ul>
          <li><a onClick={linkTo('unitRef41')}>{t('HVAC_4.1')}</a></li>
        </ul>
        {/* Deep 2 for example */}
        {/*
        <ul>
          <li><a onClick={linkTo('unitRef21')}>{t('HVAC_2.1')}</a></li>
          <ul>
            <li><a onClick={linkTo('unitRef212')}>{t('HVAC_2.1.2')}</a></li>
          </ul>
          <li><a onClick={linkTo('unitRef22')}>{t('HVAC_2.2')}</a></li>
          <ul>
            <li><a onClick={linkTo('unitRef221')}>{t('HVAC_2.2.1')}</a></li>
          </ul>
        </ul>
        */}
      </ul>
      <Wrapper>
        {/* 1 */}
        <EquipmentGroup name={t('HVAC_1')} ref={unitRef1} deep={1}>
          <Card
            ref={unitRef11}
            title={t('HVAC_1.1')}
            description={t('HVAC_1.1_DESCRIPTION')}
            brands={t('HVAC_1.1_BRANDS')}
            params={t('HVAC_1.1_PARAMS')}
            t={t}
          />
          <Card
            ref={unitRef12}
            title={t('HVAC_1.2')}
            description={t('HVAC_1.2_DESCRIPTION')}
            brands={t('HVAC_1.2_BRANDS')}
            params={t('HVAC_1.2_PARAMS')}
            t={t}
          />
          <Card
            ref={unitRef13}
            title={t('HVAC_1.3')}
            description={t('HVAC_1.3_DESCRIPTION')}
            brands={t('HVAC_1.3_BRANDS')}
            params={t('HVAC_1.3_PARAMS')}
            t={t}
          />
          <Card
            ref={unitRef14}
            title={t('HVAC_1.4')}
            description={t('HVAC_1.4_DESCRIPTION')}
            brands={t('HVAC_1.4_BRANDS')}
            params={t('HVAC_1.4_PARAMS')}
            t={t}
          />
        </EquipmentGroup>
        <EquipmentGroup name={t('HVAC_2')} ref={unitRef2} deep={1}>
          <Card
            ref={unitRef21}
            title={t('HVAC_2.1')}
            description={t('HVAC_2.1_DESCRIPTION')}
            brands={t('HVAC_2.1_BRANDS')}
            params={t('HVAC_2.1_PARAMS')}
            t={t}
          />
          <Card
            ref={unitRef22}
            title={t('HVAC_2.2')}
            description={t('HVAC_2.2_DESCRIPTION')}
            brands={t('HVAC_2.2_BRANDS')}
            params={t('HVAC_2.2_PARAMS')}
            t={t}
          />
          <Card
            ref={unitRef23}
            title={t('HVAC_2.3')}
            description={t('HVAC_2.3_DESCRIPTION')}
            brands={t('HVAC_2.3_BRANDS')}
            params={t('HVAC_2.3_PARAMS')}
            t={t}
          />
          <Card
            ref={unitRef24}
            title={t('HVAC_2.4')}
            description={t('HVAC_2.4_DESCRIPTION')}
            brands={t('HVAC_2.4_BRANDS')}
            params={t('HVAC_2.4_PARAMS')}
            t={t}
          />
        </EquipmentGroup>
        <EquipmentGroup name={t('HVAC_3')} ref={unitRef3} deep={1}>
          <Card
            ref={unitRef31}
            title={t('HVAC_3.1')}
            description={t('HVAC_3.1_DESCRIPTION')}
            brands={t('HVAC_3.1_BRANDS')}
            params={t('HVAC_3.1_PARAMS')}
            t={t}
          />
          <Card
            ref={unitRef32}
            title={t('HVAC_3.2')}
            description={t('HVAC_3.2_DESCRIPTION')}
            brands={t('HVAC_3.2_BRANDS')}
            params={t('HVAC_3.2_PARAMS')}
            t={t}
          />
        </EquipmentGroup>
        <EquipmentGroup name={t('HVAC_4')} ref={unitRef4} deep={1}>
          <Card
            ref={unitRef41}
            title={t('HVAC_4.1')}
            description={t('HVAC_4.1_DESCRIPTION')}
            brands={t('HVAC_4.1_BRANDS')}
            params={t('HVAC_4.1_PARAMS')}
            t={t}
          />
        </EquipmentGroup>
        {/* Deep 2 for example */}
        {/*
        <EquipmentGroup name='2 Title' ref={unitRef2} deep={2}>
          <EquipmentSubgroup name='2.1 Title' ref={unitRef21}>
            <Card>2.1.1</Card>
            <Card ref={unitRef212}>2.1.2</Card>
            <Card>2.1.3</Card>
            <Card>2.1.4</Card>
          </EquipmentSubgroup>
          <EquipmentSubgroup name='2.2 Title' ref={unitRef22}>
            <Card ref={unitRef221}>2.2.1</Card>
          </EquipmentSubgroup>
        </EquipmentGroup>
        */}
      </Wrapper>
    </>
  )
})