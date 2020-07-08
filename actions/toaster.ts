import { actionTypes } from '@/actions/actionTypes'
import { TType as ButtonTType } from '@/ui-kit/atoms/Button'

const { SHOW_TOAST_ASYNC, FORCE_HIDE_TOAST } = actionTypes

export type TToast = 'default' | 'error' | 'warning' | 'info' | 'success'
export type TStatus = 'show-started' | 'show-finished' | 'hide-started' | 'hide-finished'

export interface IAction {
  label: string
  linkParams?: {
    path: string
    asButton?: boolean
    btnTypeName?: ButtonTType
    isInternalLink: boolean
  }
  buttonParams?: {
    cb: () => void
    btnTypeName?: ButtonTType
  }
}
export interface IToast {
  id: number
  text: string
  delay: number
  type: TToast
  status: TStatus
  actions?: IAction[]
  isClosable?: boolean
}
export interface IShowAsyncArg {
  text: string
  delay: number
  type: TToast
  actions?: IAction[]
  isClosable?: boolean
}

export const showAsyncToast = (props: IShowAsyncArg) => {
  const { text, delay, type, actions, isClosable } = props

  return { type: SHOW_TOAST_ASYNC, payload: { text, delay, type, actions, isClosable } }
}

export const forceHideToast = (id: number) => {
  return { type: FORCE_HIDE_TOAST, payload: id }
}
