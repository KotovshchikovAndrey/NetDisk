import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common"
import { Response } from "express"
import { HttpStatusMapper } from "./utils/http.status.mapper"
import { BaseError } from "@modules/common/errors"

@Catch(BaseError)
export class RestExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpStatusMapper: HttpStatusMapper) {}

  catch(exception: BaseError, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()

    const status = this.httpStatusMapper.getStatus(exception)
    const message = exception.message
    const code = exception.code

    response.status(status).json({
      code,
      message,
    })
  }
}
