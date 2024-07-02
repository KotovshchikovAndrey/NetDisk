import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import { ValidationPipe } from "@nestjs/common"
import { ApiExceptionFilter } from "./apps/api/api.exception.filter"
import { HttpStatusMapper } from "./apps/api/utils/http.status.mapper"
import * as cookieParser from "cookie-parser"

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalFilters(new ApiExceptionFilter(new HttpStatusMapper()))
  app.useGlobalPipes(new ValidationPipe())
  app.use(cookieParser())
  await app.listen(3000)
}

bootstrap()
