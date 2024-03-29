import { combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'
import { counter, initialState as countInitialState } from './counter'
import { lang, initialState as langInitialState } from './lang'
import {
  scrollDisablingComponents,
  initialState as scrollDisablingComponentsInitialState,
} from './scroll-disabling-components'
import { userInfo, initialState as userInfoInitialState } from './user-info'
import { users, initialState as usersInitialState } from './users'
import { toaster, initialState as toasterInitialState } from './toaster'
import { globalTheme, initialState as globalThemeState } from './global-theme'
import { cookieOffer, initialState as cookieOfferState } from './cookie-offer'

const reducer = combineReducers({
  counter,
  lang,
  scrollDisablingComponents,
  userInfo,
  users,
  form: formReducer,
  toaster,
  globalTheme,
  cookieOffer,
  // Others...
})

export const rootInitialState = {
  counter: countInitialState,
  lang: langInitialState,
  scrollDisablingComponents: scrollDisablingComponentsInitialState,
  userInfo: userInfoInitialState,
  users: usersInitialState,
  form: null,
  toaster: toasterInitialState,
  globalTheme: globalThemeState,
  cookieOffer: cookieOfferState,
  // Others...
}

// export type TRootState = ReturnType<typeof reducer>

export default reducer
