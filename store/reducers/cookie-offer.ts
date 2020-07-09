import { createSymbiote } from 'redux-symbiote'

export const initialState = {
  isEnabled: false,
}

export const { actions: cookieOfferActions, reducer: cookieOffer } = createSymbiote(
  initialState,
  {
    enable: (state) => ({ ...state, isEnabled: true }),
    disable: (state) => ({ ...state, isEnabled: false }),
    reset: () => ({ ...initialState }),
  },
  'globalTheme'
)
