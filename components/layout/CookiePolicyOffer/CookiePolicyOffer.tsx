import React, { useCallback, useEffect } from 'react'
import styled from 'styled-components'
import { Button } from '@/ui-kit/atoms'
import Cookie from 'js-cookie'
import { withTranslator } from '@/hocs/with-translator'
import { cookieOfferActions } from '@/store/reducers/cookie-offer'
import { useDispatch, useSelector } from 'react-redux'
import { IRootState } from '@/store/reducers/IRootState'

const confirmCookieExpiresDays = process.env.REACT_APP_CONFIRM_COOKIE_EXPIRES_IN_DAYS
  ? Number(process.env.REACT_APP_CONFIRM_COOKIE_EXPIRES_IN_DAYS)
  : 0

const CookiePolicyOfferWrapper = styled('div')`
  z-index: 1000001;
  width: 100%;
  min-height: 70px;

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
  padding: 10px 20px 10px 20px;
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
  const isOfferEnabled = useSelector((state: IRootState) => state.cookieOffer.isEnabled)
  const dispatch = useDispatch()
  const handleConfirm = useCallback(() => {
    Cookie.set('cookie-confirmed', '1', { expires: confirmCookieExpiresDays })
    dispatch(cookieOfferActions.disable())
  }, [])

  useEffect(() => {
    if (!!window && !Cookie.get('cookie-confirmed')) {
      dispatch(cookieOfferActions.enable())
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
                href="https://ru.wikipedia.org/wiki/Cookie"
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
