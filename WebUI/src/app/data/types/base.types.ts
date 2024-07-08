export interface IResponse<T> {
  message: string
  data: T
}

export interface IErrorResponse {
  code: string
  message: string
}
