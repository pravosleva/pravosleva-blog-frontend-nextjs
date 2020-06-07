export namespace ResponseLocal {
  export interface IResult {
    isOk: boolean
    response?: any
    msg?: string
  }

  export interface IResultSuccess {
    isOk: boolean
    response: any
  }

  export interface IResultError {
    isOk: boolean
    msg: string
  }
}
