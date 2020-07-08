import { put, takeEvery, call } from 'redux-saga/effects'
import { actionTypes } from '@/actions'

const {
  SHOW_TOAST_ASYNC,
  SHOW_TOAST_START,
  SHOW_TOAST_FINISH,
  HIDE_TOAST_START,
  HIDE_TOAST_FINISH,
  REMOVE_TOAST,
  FORCE_HIDE_TOAST,
} = actionTypes

export const delay = (ms: number) => new Promise((res) => setTimeout(res, ms))
export function* asyncToastWorker({ payload }: any) {
  const id = Math.random()

  // eslint-disable-next-line no-console
  console.log(payload)

  yield put({
    type: SHOW_TOAST_START,
    payload: { text: payload.text, id, type: payload.type, actions: payload.actions, isClosable: payload.isClosable },
  })
  yield call(delay, 100)
  yield put({ type: SHOW_TOAST_FINISH, payload: id })
  yield call(delay, payload.delay)
  yield put({ type: HIDE_TOAST_START, payload: id })
  yield call(delay, 500)
  yield put({ type: HIDE_TOAST_FINISH, payload: id })
  yield call(delay, 500)
  yield put({ type: REMOVE_TOAST, payload: id })
}
export function* forceHideToastWorker({ payload }: any) {
  yield put({ type: HIDE_TOAST_START, payload })
  yield call(delay, 100)
  yield put({ type: HIDE_TOAST_FINISH, payload })
  yield call(delay, 500)
  yield put({ type: REMOVE_TOAST, payload })
}
export function* watchToaster() {
  yield takeEvery(SHOW_TOAST_ASYNC, asyncToastWorker)
  yield takeEvery(FORCE_HIDE_TOAST, forceHideToastWorker)
}
