import { actionTypes, IToast } from '@/actions'

const { SHOW_TOAST_START, SHOW_TOAST_FINISH, HIDE_TOAST_START, HIDE_TOAST_FINISH, REMOVE_TOAST } = actionTypes

export const initialState = {
  items: [],
}

export const toaster = (state = initialState, action: any) => {
  var targetItemIndex: number
  var newItems: IToast[]
  switch (action.type) {
    case SHOW_TOAST_START:
      return {
        ...state,
        items: [
          ...state.items,
          {
            text: action.payload.text,
            id: action.payload.id,
            status: 'show-started',
            delay: action.payload.delay,
            type: action.payload.type || 'default',
          },
        ],
      }
    case SHOW_TOAST_FINISH:
      targetItemIndex = state.items.findIndex((e) => e.id === action.payload)
      newItems = [...state.items]
      newItems[targetItemIndex].status = 'show-finished'

      return { ...state, items: newItems }
    case HIDE_TOAST_START:
      targetItemIndex = state.items.findIndex((e) => e.id === action.payload)

      if (targetItemIndex === -1) return state

      newItems = [...state.items]
      newItems[targetItemIndex].status = 'hide-started'

      return { ...state, items: newItems }
    case HIDE_TOAST_FINISH:
      targetItemIndex = state.items.findIndex((e) => e.id === action.payload)

      if (targetItemIndex === -1) return state

      newItems = [...state.items]
      newItems[targetItemIndex].status = 'hide-finished'

      return { ...state, items: newItems }
    case REMOVE_TOAST:
      targetItemIndex = state.items.findIndex((e) => e.id === action.payload)

      if (targetItemIndex === -1) return state

      return { ...state, items: [...state.items].filter((e) => e.id !== action.payload) }
    default:
      return state
  }
}
