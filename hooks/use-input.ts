import { useState } from 'react'

export const useInput = (initialValue: string) => {
  const [value, setValue] = useState(initialValue)

  return {
    value,
    setValue,
    reset: () => setValue(''),
    bind: {
      value,
      onChange: (event: any) => {
        setValue(event.target.value)
      },
    },
  }
}

export const useInputDate = (initialValue: Date | null) => {
  const [value, setValue] = useState(initialValue)

  return {
    value,
    setValue,
    reset: () => setValue(null),
    bind: {
      value,
      onChange: (arg: any) => {
        setValue(arg)
      },
    },
  }
}
