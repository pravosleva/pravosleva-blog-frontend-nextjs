import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import { Button } from '@/ui-kit/atoms'
import Cookie from 'js-cookie'
import { withTranslator } from '@/hocs/with-translator'

const CookiePolicyOfferWrapper = styled('div')`
  z-index: 1000001;
  width: 100%;
  height: 70px;

  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.9);
`

const CookiePolicyOfferContent = styled('div')`
  width: 100%;
  max-width: 1000px;
  padding: 0 20px 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  > div:first-child {
    margin-right: 20px;
  }
  > div > span,
  > div > a {
    font-size: 0.9em;
  }
`

interface IProps {
  t: (text: string) => string
}

const CookiePolicyOfferTranslated = ({
  // Translator:
  t,
}: IProps) => {
  const [isOfferEnabled, setIsOfferEnabled] = useState(false)
  const handleConfirm = useCallback(() => {
    Cookie.set('cookie-confirmed', '1')
    setIsOfferEnabled(false)
  }, [])

  useEffect(() => {
    if (!!window && !Cookie.get('cookie-confirmed')) {
      setIsOfferEnabled(true)
    }
  }, [])

  return (
    <>
      {isOfferEnabled && (
        <CookiePolicyOfferWrapper>
          <CookiePolicyOfferContent>
            <div>
              <span>{t('COOKIE_POLICY_TEXT')}.</span>{' '}
              <a
                className="cookie-policy-offer"
                target="_blank"
                rel="noreferrer"
                href="https://legal.my.com/us/general/cookie/"
              >
                {t('READ_MORE_HERE')}
              </a>
              .
            </div>
            <div>
              <Button onClick={handleConfirm} typeName="orange" width="narrow" size="xsmall">
                {t('I_AGREE')}
              </Button>
            </div>
          </CookiePolicyOfferContent>
        </CookiePolicyOfferWrapper>
      )}
    </>
  )
}

export const CookiePolicyOffer = withTranslator(CookiePolicyOfferTranslated)
