import { createSymbiote } from 'redux-symbiote'

export const initialState = {
  theme: 'light',
}

export const { actions: globalThemeActions, reducer: globalTheme } = createSymbiote(
  initialState,
  {
    setTheme: (state, value) => ({ ...state, theme: value }),
    resetTheme: () => ({ ...initialState }),
  },
  'globalTheme'
)
