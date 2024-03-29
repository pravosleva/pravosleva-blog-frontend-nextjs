import React, { useState, useCallback, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Recaptcha } from '@/components/RecaptchaV3-2'
import { useInput } from '@/hooks/use-input'
import { Layout } from '@/components/layout'
import styled, { StyledComponent } from 'styled-components'
import { useRouter } from 'next/router'
import { loadReCaptcha } from 'react-recaptcha-v3'
import { post } from '@/helpers/services/restService'
import { showAsyncToast } from '@/actions'
import { withTranslator } from '@/hocs/with-translator'
import { AnimatePresence, motion } from 'framer-motion'
import NextNProgress from 'nextjs-progressbar'
// <NextNProgress color="#FFF" startPosition={0.3} stopDelayMs={200} height={2} />
import { metrics } from '@/constants'

const isProd = process.env.NODE_ENV === 'production'

const easing = [0.6, -0.05, 0.01, 0.99]
const fadeInUp = {
  initial: {
    y: 60,
    opacity: 0,
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: easing,
    }
  }
}

const RECAPTCHAV3_CLIENT_KEY = process.env.RECAPTCHAV3_CLIENT_KEY
const RECAPTCHAV3_VERIFY_URL = process.env.RECAPTCHAV3_VERIFY_URL
const recaptchaScoreLimit = 0.9

const Container: StyledComponent<'div', any, {}, never> = styled('div')`
  @media (min-width: 768px) {
    padding: 0;
    max-width: 400px;
    margin: 0 auto;
  }
  @media (max-width: 767px) {
    padding: 20px;
  }
`

const Feedback = ({ t }) => {
  const router = useRouter()
  const [wasSent, setWasSent] = useState(false)
  const [isRecaptchaShowed, setIsRecaptchaShowed] = useState(false)
  const { value: companyName, bind: bindCompanyName } = useInput('')
  const { value: contactName, bind: bindContactName, reset: resetContactName } = useInput('')
  const { value: comment, bind: bindComment, reset: resetComment } = useInput('')
  const showRecaptcha = (e: any) => {
    e.preventDefault()
    setIsRecaptchaShowed(true)
  }
  const send = useCallback(
    async (token: string): Promise<string> => {
      const verifyResult = await post(
        RECAPTCHAV3_VERIFY_URL,
        new URLSearchParams({
          captcha: token,
        })
      )
      
      if (verifyResult.isOk) {
        if (verifyResult?.response.original?.score >= recaptchaScoreLimit) {
          if (typeof window !== 'undefined' && isProd) {
            // @ts-ignore
            ym(
              metrics.yaCounter,
              'reachGoal',
              'send_feedback',
              undefined,
              () => {
                // eslint-disable-next-line no-console
                console.log('ym: [send_feedback] done')
              }
            )
          }
          const createNewEntryResult = await post(
            '/entries',
            new URLSearchParams({
              companyName,
              contactName,
              comment,
            })
          )

          if (createNewEntryResult.isOk) {
            return Promise.resolve('New Entry created')
          }
        } else {
          return Promise.reject(
            `Bot detected! Your score by Google ${verifyResult?.response.original?.score}. Humans limit was set to ${recaptchaScoreLimit}`
          )
        }
      }

      return Promise.reject(verifyResult?.msg)
    },
    [comment, companyName, contactName]
  )
  const dispatch = useDispatch()
  const onResolved = useCallback(
    (token) => {
      send(token)
        .then((msg) => {
          dispatch(showAsyncToast({ text: msg, delay: 7000, type: 'success' }))
          // resetCompanyName()
          resetContactName()
          resetComment()
        })
        .then(() => {
          setIsRecaptchaShowed(false)
          setWasSent(true)
        })
        .then(() => {
          router.push('/feedback/thanks')
        })
        .catch((text) => {
          dispatch(showAsyncToast({ text, delay: 10000, type: 'error' }))
          router.push(`/feedback/sorry?msg=${encodeURIComponent(text)}`)
        })
    },
    [dispatch, resetComment, resetContactName, router, send]
  )
  useEffect(() => {
    if (process.browser) {
      loadReCaptcha(RECAPTCHAV3_CLIENT_KEY)
      dispatch(
        showAsyncToast({
          text: t('FEEDBACK_PAGE_IN_PROGRESS'),
          delay: 60000,
          type: 'warning',
          isClosable: true,
          actions: [
            {
              label: t('GO_BACK_TO_THE_HOMEPAGE'),
              linkParams: {
                asButton: true,
                btnTypeName: 'secondaryWhite',
                path: '/',
                isInternalLink: true,
              },
            },
            // {
            //   label: t('GO_BACK_TO_THE_HOMEPAGE'),
            //   buttonParams: {
            //     cb: () => console.log('text'),
            //   },
            // },
            // {
            //   label: 'yandex',
            //   linkParams: {
            //     asButton: true,
            //     path: 'https://yandex.ru',
            //     isInternalLink: false,
            //   },
            // },
          ],
        })
      )
    }
    return () => {
      if (process.browser) {
        // Derty hack =)
        if (!!document.querySelector('.grecaptcha-badge')) {
          document.querySelector('.grecaptcha-badge').parentElement.remove()
        }
      }
    }
  }, [])

  return (
    <AnimatePresence exitBeforeEnter>
      <Layout>
        <NextNProgress color="#FFF" startPosition={0.3} stopDelayMs={200} height={2} options={{ showSpinner: false }} />
        <motion.div exit={{ opacity: 0 }} initial='initial' animate='animate' key="/feedback">
          <Container className="box">
            {!wasSent && (
              <motion.div variants={fadeInUp}>
              <form onSubmit={showRecaptcha}>
                <h2 className="gradient-animate-effect">{t('FEEDBACK')}</h2>
                <div className="inputBox">
                  <input maxLength={50} name="companyName" placeholder="invisible" {...bindCompanyName} required />
                  <label>{t('COMPANY_NAME')} / {50 - companyName.length} left</label>
                </div>
                <div className="inputBox">
                  <input disabled={companyName.length === 0} maxLength={50} name="contactName" placeholder="invisible" {...bindContactName} required />
                  <label>{t('YOUR_NAME')} / {50 - contactName.length} left</label>
                </div>
                <div className="inputBox">
                  <textarea disabled={companyName.length === 0 || contactName.length === 0} maxLength={3000} name="comment" placeholder="invisible" {...bindComment} required />
                  <label>{t('COMMENT')} / {3000 - comment.length} left</label>
                </div>
                <div className="special-link-wrapper fade-in-effect unselectable">
                  <button className="rippled-btn" type="submit">
                    {t('SUBMIT')}
                  </button>
                  {isRecaptchaShowed && <Recaptcha onToken={onResolved} action="feedback" />}
                </div>
              </form>
              </motion.div>
            )}
          </Container>
        </motion.div>
      </Layout>
    </AnimatePresence>
  )
}

export default withTranslator(Feedback)
