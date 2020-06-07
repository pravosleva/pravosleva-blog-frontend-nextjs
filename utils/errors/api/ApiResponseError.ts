import { UniversalError } from '@/utils/errors'

interface IError {
  [x: string]: string[]
}

export class ApiResponseError extends UniversalError {
  constructor(public errors?: IError[]) {
    super('ApiResponseError')

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, ApiResponseError.prototype)
  }

  getErrorMsg(): string {
    const normalizedName = this.getReadableCamelCase(this.name)
    let errorsStr = ''

    if (!!this.errors && Object.keys(this.errors).length > 0) {
      Object.keys(this.errors).forEach((e: string) => {
        if (Array.isArray(this.errors[e])) {
          this.errors[e].forEach((str: string) => {
            errorsStr += `, ${str}`
          })
        }
      })
    } else {
      errorsStr = ', Ошибки не получены с бэка'
    }

    return normalizedName.concat(': ', errorsStr.slice(2))
  }
}
