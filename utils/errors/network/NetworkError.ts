import { UniversalError } from '@/utils/errors'

export class NetworkError extends UniversalError {
  constructor() {
    super('NetworkError')

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, NetworkError.prototype)
  }

  getErrorMsg(): string {
    return this.getReadableCamelCase(this.name)
  }
}
