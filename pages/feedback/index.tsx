import { useState, useCallback, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Recaptcha } from '@/components/RecaptchaV3-2'
import { useInput } from '@/hooks/use-input'
import { Layout } from '@/components/layout'
import styled, { StyledComponent } from 'styled-components'
import { useRouter } from 'next/router'
import { loadReCaptcha } from 'react-recaptcha-v3'
import { post } from '@/helpers/services/restService'
import { showAsyncToast } from '@/actions'

const RECAPTCHAV3_CLIENT_KEY = process.env.RECAPTCHAV3_CLIENT_KEY
const RECAPTCHAV3_VERIFY_URL = process.env.RECAPTCHAV3_VERIFY_URL
const recaptchaScoreLimit = 0.95

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

const Feedback = () => {
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
  const send = async (token: string): Promise<string> => {
    const verifyResult = await post(
      RECAPTCHAV3_VERIFY_URL,
      new URLSearchParams({
        captcha: token,
      })
    )

    if (verifyResult.isOk) {
      if (verifyResult?.response.original?.score > recaptchaScoreLimit) {
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
  }
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
    [send]
  )
  useEffect(() => {
    if (process.browser) {
      loadReCaptcha(RECAPTCHAV3_CLIENT_KEY)
    }
    return () => {
      if (process.browser) {
        // Derty hack =)
        document.querySelector('.grecaptcha-badge').parentElement.remove()
      }
    }
  }, [])

  return (
    <Layout>
      <Container className="box">
        {!wasSent && (
          <form onSubmit={showRecaptcha}>
            <h2 className="gradient-animate-effect">Feedback</h2>
            <div className="inputBox">
              <input name="companyName" placeholder="invisible" {...bindCompanyName} required />
              <label>Company name</label>
            </div>
            <div className="inputBox">
              <input name="contactName" placeholder="invisible" {...bindContactName} required />
              <label>Your name</label>
            </div>
            <div className="inputBox">
              <textarea name="comment" placeholder="invisible" {...bindComment} required />
              <label>Comment</label>
            </div>
            <div className="special-link-wrapper fade-in-effect unselectable">
              <button className="rippled-btn" type="submit">
                Submit
              </button>
              {isRecaptchaShowed && <Recaptcha onToken={onResolved} action="feedback" />}
            </div>
          </form>
        )}
      </Container>
    </Layout>
  )
}

export default Feedback
