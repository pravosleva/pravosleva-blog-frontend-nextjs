import { getStringWithUpperCaseFirstChar } from '@/utils/getStringWithUpperCaseFirstChar'

export const getErrorString = (errors: any): string | null => {
  if (!!errors) {
    return (
      Object.keys(errors)
        // v1
        .map((e) => `${getStringWithUpperCaseFirstChar(e)}: ${errors[e]}`)
        // v2
        // .map((e) => errors[e])
        .join('\n')
    )
  } else {
    return null
  }
}
