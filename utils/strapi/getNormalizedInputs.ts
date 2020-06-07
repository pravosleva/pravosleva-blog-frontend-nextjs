import { TLoginInputs } from '@/pages/auth/login'

export const getNormalizedInputs = (inputs: TLoginInputs) => {
  const fromTo = [
    ['email', 'identifier'],
    ['username', 'identifier'],
  ]
  const result = {}

  Object.keys(inputs).forEach((key) => {
    const targetIndex = fromTo.findIndex((arr) => arr[0] === key)
    const shouldBeNormalized = targetIndex !== -1

    if (shouldBeNormalized) {
      const value = inputs[key]
      const newKey = fromTo[targetIndex][1]

      result[newKey] = value
    } else {
      result[key] = inputs[key]
    }
  })

  return result
}
