import React from 'react'
import { TUserData } from '@/components/covid-trash/like-gosuslugi/UserInfoSection/interfaces'
import styled from 'styled-components'

const Wrapper = styled('div')`
  display: flex;
  flex-direction: column;
`

const getCensoredFullName = (fullName: string): string => {
  const splitedBySpace = fullName.split(' ')
  let results: string[] = []

  splitedBySpace.forEach((str) => {
    const firstSymbol = str[0]
    const censored = `${firstSymbol}${'*'.repeat(str.length - 1)}`

    results.push(censored)
  })

  return results.join(' ')
}
const getModifiedDate = (dateOfBirth: string): string => {
  const splitedByDash = dateOfBirth.split('-').reverse()

  return splitedByDash.join('.')
}
const getModifiedPassportSN = (passportSN: number): string => {
  const asString = String(passportSN)
  const asArr = asString.split('')
  let result = ''

  asArr.forEach((s, i) => {
    switch (true) {
      case i === 4:
        result += ' *'
        break;
      case i === 2 || i === 3 || i === 5 || i === 6:
        result += '*'
        break;
      default:
        result += s
        break;
    }
  })

  return result
}

export const UserInfoSection = ({ userData }: { userData: TUserData }) => {
  return (
    <Wrapper>
      <div>UserInfoSection</div>
      <div><b>{getCensoredFullName(userData.fullName)}</b></div>
      <div>Паспорт: {getModifiedPassportSN(userData.passportSN)}</div>
      <div>Дата рождения: {getModifiedDate(userData.dateOfBirth)}</div>
    </Wrapper>
  )
}