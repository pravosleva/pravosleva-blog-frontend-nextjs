import { applyMiddleware, createStore } from 'redux'
import createSagaMiddleware from 'redux-saga'
import rootReducer, { rootInitialState } from './reducers'
import rootSaga from './sagas'
import { IRootState } from './reducers/IRootState'

const isDev = process.env.NODE_ENV !== 'production'

const bindMiddleware = (mws: any) => {
  if (isDev) {
    const { composeWithDevTools } = require('redux-devtools-extension')
    return composeWithDevTools(applyMiddleware(...mws))
  }
  return applyMiddleware(...mws)
}

export const initializeStore = (initialState: any = rootInitialState) => {
  const sagaMiddleware = createSagaMiddleware()
  const store: IRootState = createStore(rootReducer, initialState, bindMiddleware([sagaMiddleware]))

  store.sagaTask = sagaMiddleware.run(rootSaga)

  return store
}
