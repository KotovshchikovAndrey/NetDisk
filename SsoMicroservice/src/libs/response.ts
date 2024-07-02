import { camelToSnakeCaseFields } from "./transform"

export class Response {
  readonly message: string
  readonly data: object | null

  constructor(message: string, data: object | null) {
    this.message = message
    this.data = camelToSnakeCaseFields(data)
  }
}

export class ErrorResponse {
  constructor(readonly code: string, readonly message: string) {}
}
