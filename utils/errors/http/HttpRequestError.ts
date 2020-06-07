import { UniversalError } from '@/utils/errors'

export class HttpRequestError extends UniversalError {
  constructor(public status: number, public message: string) {
    super('HttpRequestError')

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, HttpRequestError.prototype)
  }

  getErrorMsg(): string {
    const normalizedName = this.getReadableCamelCase(this.name)

    return `${normalizedName} ${this.status}: ${this.message}`
  }
}
