import { combineReducers } from 'redux'

import { counter } from './counter'
import { lang } from './lang'
import { scrollDisablingComponents } from './scroll-disabling-components'
import { userInfo } from './user-info'
import { users } from './users'
// Others...

export default combineReducers({
  counter,
  lang,
  scrollDisablingComponents,
  userInfo,
  users,
  // Others...
})
