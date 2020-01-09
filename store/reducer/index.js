import { combineReducers } from 'redux';

import { counter } from './counter';
import { lang } from './lang';
// Others...


export default combineReducers({
  counter,
  lang,
  // Others...
});
