import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common"
import { Response as NestResponse } from "express"
import { HttpStatusMapper } from "./http.status.mapper"
import { BaseError } from "@modules/common/error"
import { ErrorResponse } from "@modules/common/response"

@Catch(BaseError)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpStatusMapper: HttpStatusMapper) {}

  catch(exception: BaseError, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<NestResponse>()

    const status = this.httpStatusMapper.getStatus(exception)
    const message = exception.message
    const code = exception.code

    response.status(status).json(new ErrorResponse(code, message))
  }
}
