import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import { ValidationPipe } from "@nestjs/common"
import { HttpStatusMapper } from "./modules/auth/adapters/transport/rest/utils/http.status.mapper"
import * as cookieParser from "cookie-parser"
import { RestExceptionFilter } from "@modules/auth/adapters/transport/rest/rest.exception.filter"

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalFilters(new RestExceptionFilter(new HttpStatusMapper()))
  app.useGlobalPipes(new ValidationPipe())
  app.use(cookieParser())
  await app.listen(3000)
}

bootstrap()
