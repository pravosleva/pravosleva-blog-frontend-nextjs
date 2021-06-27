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
// @font-face {
//   font-family: 'Helvetica Neue';
//   src: url('/static/fonts/HelveticaNeue/HelveticaNeueCyr-Roman.woff') format('woff'), url('/static/fonts/HelveticaNeue/HelveticaNeueCyr-Roman.ttf') format('truetype');
//   font-weight: 300;
//   font-style: normal;
// }
@font-face {
  font-family: 'Lato-Bold';
  src: url('/static/fonts/Lato/Lato-Bold.woff') format('woff'), url('/static/fonts/Lato/Lato-Bold.ttf') format('truetype');
  font-weight: 400;
  font-style: normal;
}
@font-face {
  font-family: 'Lato';
  src: url('/static/fonts/Lato/Lato-Regular.woff') format('woff'), url('/static/fonts/Lato/Lato-Regular.ttf') format('truetype');
  font-weight: 400;
  font-style: normal;
}
* {
  font-family: 'Lato', helvetica, arial, sans-serif !important;
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
  background: #fafcff;
}
`;

const ExternalWrapper = styled('div')`
  padding: 0 17px;
`
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
      <ExternalWrapper>
        <Wrapper>
          <SiteHeaderSection />
          <GreenCardSection />
          <UserInfoSection userData={userData} />
          <CloseBtnSection />
        </Wrapper>
      </ExternalWrapper>
    </>
  )
}
