import { combineReducers, createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunkMiddleware from 'redux-thunk';

import reducer from './reducer';


export const initializeStore = () => {
  return createStore(
    reducer,
    {}, // initialState
    composeWithDevTools(applyMiddleware(thunkMiddleware)),
  );
};
