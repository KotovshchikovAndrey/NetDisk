import { Module } from "@nestjs/common"
import { AuthRestController } from "./adapters/transport/rest/auth.controller"
import { MongooseModule } from "@nestjs/mongoose"
import {
  TokenModel,
  TokenSchema,
  UserModel,
  UserSchema,
} from "./adapters/storage/mongo/model"
import {
  REDIS_CLIENT_PROVIDER,
  SESSION_REPOSITORY_PROVIDER,
  TOKEN_REPOSITORY_PROVIDER,
  USER_REPOSITORY_PROVIDER,
} from "./core/configs/settings"
import { UserMongoRepository } from "./adapters/storage/mongo/user.repository"
import { TokenMongoRepository } from "./adapters/storage/mongo/token.repository"
import { AuthService } from "./core/services/auth.service"
import { TokenService } from "./core/services/token.service"
import Redis from "ioredis"
import { ConfigService } from "@nestjs/config"
import { SessionRedisRepository } from "./adapters/storage/redis/session.repository"
import { SessionService } from "./core/services/session.service"
import { SendVerificationCodeHandler } from "./core/events/handlers/send-verification-code.handler"

@Module({
  controllers: [AuthRestController],
  imports: [
    MongooseModule.forFeature(
      [{ name: UserModel.name, schema: UserSchema }],
      "users",
    ),

    MongooseModule.forFeature(
      [{ name: TokenModel.name, schema: TokenSchema }],
      "tokens",
    ),
  ],
  providers: [
    {
      provide: REDIS_CLIENT_PROVIDER,
      useFactory: (configService: ConfigService) => {
        const redisClient = new Redis({
          host: configService.get<string>("REDIS_HOST"),
          port: configService.get<number>("REDIS_PORT"),
          password: configService.get<string>("REDIS_PASSWORD"),
        })

        redisClient.on("error", (e) => {
          throw new Error(`Redis connection failed: ${e}`)
        })

        return redisClient
      },
      inject: [ConfigService],
    },
    {
      provide: USER_REPOSITORY_PROVIDER,
      useClass: UserMongoRepository,
    },
    {
      provide: TOKEN_REPOSITORY_PROVIDER,
      useClass: TokenMongoRepository,
    },
    {
      provide: SESSION_REPOSITORY_PROVIDER,
      useClass: SessionRedisRepository,
    },

    AuthService,
    TokenService,
    SessionService,

    SendVerificationCodeHandler,
  ],
})
export class AuthModule {}
