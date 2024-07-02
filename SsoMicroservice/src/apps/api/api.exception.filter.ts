import { BaseError } from "@libs/ddd"
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from "@nestjs/common"
import { Response } from "express"
import { HttpStatusMapper } from "./utils/http.status.mapper"

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpStatusMapper: HttpStatusMapper) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()

    let status: number = HttpStatus.INTERNAL_SERVER_ERROR
    let message: string = "Internal server error"
    let code: string = "ERR_INTERNAL"

    if (exception instanceof BaseError) {
      status = this.httpStatusMapper.getStatus(exception)
      message = exception.message
      code = exception.code
    }

    response.status(status).json({
      code,
      message,
    })
  }
}
