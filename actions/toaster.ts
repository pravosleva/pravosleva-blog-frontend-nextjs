import { actionTypes } from '@/actions/actionTypes'

const { SHOW_TOAST_ASYNC, FORCE_HIDE_TOAST } = actionTypes

export type TToast = 'default' | 'error' | 'warning' | 'info' | 'success'
export type TStatus = 'show-started' | 'show-finished' | 'hide-started' | 'hide-finished'

export interface IToast {
  id: number
  text: string
  delay: number
  type: TToast
  status: TStatus
}
export interface IShowAsyncArg {
  text: string
  delay: number
  type: TToast
}

export const showAsyncToast = (props: IShowAsyncArg) => {
  const { text, delay, type } = props

  return { type: SHOW_TOAST_ASYNC, payload: { text, delay, type } }
}

export const forceHideToast = (id: number) => {
  return { type: FORCE_HIDE_TOAST, payload: id }
}
