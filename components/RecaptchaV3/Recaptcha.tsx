import React, { FC, useEffect } from 'react'
import { useRecaptcha, Badge } from 'react-recaptcha-hook'

const RECAPTCHAV3_CLIENT_KEY = process.env.RECAPTCHAV3_CLIENT_KEY

export interface IRecaptchaProps {
  action?: string
  sitekey?: string
  onToken: (token: string) => void
}

export const Recaptcha: FC<IRecaptchaProps> = (props) => {
  const { sitekey = RECAPTCHAV3_CLIENT_KEY, action, onToken } = props
  const execute = useRecaptcha({ sitekey, hideDefaultBadge: false })

  useEffect(() => {
    const getToken = async () => {
      const token = await execute(action)
      onToken(token)
    }

    getToken()
  }, [action, execute, onToken])

  return <Badge />
}
