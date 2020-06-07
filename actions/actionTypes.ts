export const actionTypes = {
  // 1. example
  LOAD_DATA_FAILURE: 'LOAD_DATA_FAILURE',
  INCREMENT: 'INCREMENT',
  DECREMENT: 'DECREMENT',
  RESET: 'RESET',
  LOAD_DATA_SUCCESS: 'LOAD_DATA_SUCCESS',
  TICK_CLOCK: 'TICK_CLOCK',
  // sagas
  START_CLOCK: 'START_CLOCK',
  LOAD_DATA: 'LOAD_DATA',

  // 2. toaster
  SHOW_TOAST_START: 'SHOW_TOAST_START',
  SHOW_TOAST_FINISH: 'SHOW_TOAST_FINISH',
  HIDE_TOAST_START: 'HIDE_TOAST_START',
  HIDE_TOAST_FINISH: 'HIDE_TOAST_FINISH',
  REMOVE_TOAST: 'REMOVE_TOAST',
  FORCE_HIDE_TOAST: 'FORCE_HIDE_TOAST',
  // sagas
  SHOW_TOAST_ASYNC: 'SHOW_TOAST_ASYNC',
}
