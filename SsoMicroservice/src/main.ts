import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import { ValidationPipe } from "@nestjs/common"
import * as cookieParser from "cookie-parser"
import { HttpExceptionFilter } from "./http-exception.filter"
import { HttpStatusMapper } from "./http-status.mapper"

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalFilters(new HttpExceptionFilter(new HttpStatusMapper()))
  app.use(cookieParser())
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  )

  app.enableCors({ credentials: true, origin: "http://127.0.0.1:4200" })
  await app.listen(3000)
}

bootstrap()
