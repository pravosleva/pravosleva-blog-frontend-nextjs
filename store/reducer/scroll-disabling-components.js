import { createSymbiote } from 'redux-symbiote';


const initialState = {
  list: []
};

export const { actions: scrollDisablingComponentsActions, reducer: scrollDisablingComponents } = createSymbiote(
  initialState,
  {
    add: (state, payload) => ({ ...state, list: [...state.list, payload] }),
    remove: (state, payload) => ({ ...state, list: [...state.list].filter(e => e !== payload) }),
    reset: (state, payload) => ({ ...initialState }),
  },
  'scrollDisablingComponents',
);
