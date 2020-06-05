import { createSymbiote } from 'redux-symbiote';


const initialState = {
  count: 0,
};

export const { actions: counterActions, reducer: counter } = createSymbiote(
  initialState,
  {
    // fillDelta: (state, payload) => ({ ...state, ...payload }),
    increment: (state, payload) => ({ ...state, count: state.count + 1 }),
    decrement: (state, payload) => ({ ...state, count: state.count - 1 }),
    reset: (state, payload) => ({ ...state, count: 0 }),
    set: (state, payload) => ({ ...state, count: payload }),
  },
  'counter',
);
