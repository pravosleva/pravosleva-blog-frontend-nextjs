import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import { Button } from '@/ui-kit/atoms'
import Cookie from 'js-cookie'

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

export const CookiePolicyOffer = () => {
  const [isOfferEnabled, setIsOfferEnabled] = useState(false)
  const handleConfirm = useCallback(() => {
    // eslint-disable-next-line no-console
    console.log('Confirm')
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
              <span>By using the site, you agree to our cookie policy.</span>{' '}
              <a
                className="cookie-policy-offer"
                target="_blank"
                rel="noreferrer"
                href="https://legal.my.com/us/general/cookie/"
              >
                Read more here
              </a>
              .
            </div>
            <div>
              <Button onClick={handleConfirm} typeName="orange" width="narrow" size="xsmall">
                I Agree
              </Button>
            </div>
          </CookiePolicyOfferContent>
        </CookiePolicyOfferWrapper>
      )}
    </>
  )
}
