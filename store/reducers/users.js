import { createSymbiote } from 'redux-symbiote'

export const initialState = {
  items: [],
}

export const { actions: usersActions, reducer: users } = createSymbiote(
  initialState,
  {
    // fillDelta: (state, payload) => ({ ...state, ...payload }),
    reset: (state, payload) => ({ ...initialState }),
    set: (state, payload) => ({ ...state, items: payload }),
  },
  'users'
)
