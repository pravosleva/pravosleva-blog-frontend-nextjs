import React from 'react'
import { TUserData } from '@/components/covid-trash/like-gosuslugi/UserInfoSection/interfaces'
import {
  SiteHeaderSection,
  GreenCardSection,
  UserInfoSection,
  CloseBtnSection,
} from '@/components/covid-trash/like-gosuslugi'
import Head from 'next/head'
import styled from 'styled-components'

type TProps = {
  userData: TUserData
}

const GosuslugiFonts = `
@font-face {
  font-family: 'Helvetica Neue';
  src: url('/static/fonts/HelveticaNeue/HelveticaNeueCyr-Roman.woff') format('woff'), url('/static/fonts/HelveticaNeue/HelveticaNeueCyr-Roman.ttf') format('truetype');
  font-weight: 300;
  font-style: normal;
}
* {
  font-family: 'Helvetica Neue', helvetica, arial, sans-serif !important;
  font-size: 100%;
  font-weight: normal;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
body {
  color: #3b3b3b;
  font-size: 15px;
  line-height: normal;
}
`;

const Wrapper = styled('div')`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 350px;
  margin: 0 auto;

  // & > div:not(:last-child) { margin-bottom: 30px; }
`

export const CertVerifiedPage = ({ userData }: TProps) => {
  return (
    <>
      <Head>
        <style type="text/css" dangerouslySetInnerHTML={{ __html: GosuslugiFonts }} />
      </Head>
      <Wrapper>
        <SiteHeaderSection />
        <GreenCardSection />
        <UserInfoSection userData={userData} />
        <CloseBtnSection />
      </Wrapper>
      {/* <div style={{ border: '1px solid red' }}>{passportSN}, {fullName}, {dateOfBirth}</div> */}
    </>
  )
}
