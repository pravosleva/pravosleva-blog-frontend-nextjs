import { all } from 'redux-saga/effects'

// import { watchLoadData } from './example-axiosLoadData'
import { watchToaster } from './toaster'

function* rootSaga() {
  yield all([watchToaster()])
}

export default rootSaga
