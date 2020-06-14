import React from 'react'
import { ReCaptcha } from 'react-recaptcha-v3'

const RECAPTCHAV3_CLIENT_KEY = process.env.RECAPTCHAV3_CLIENT_KEY

export interface IRecaptchaProps {
  action?: string
  sitekey?: string
  onToken: (token: string) => void
}

export const Recaptcha: React.FC<IRecaptchaProps> = (props) => {
  return <ReCaptcha sitekey={RECAPTCHAV3_CLIENT_KEY} action={props.action} verifyCallback={props.onToken} />
}
