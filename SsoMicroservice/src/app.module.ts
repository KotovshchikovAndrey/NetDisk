import { AuthModule } from "@modules/auth/auth.module"
import { Module } from "@nestjs/common"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { MongooseModule } from "@nestjs/mongoose"

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>("MONGO_ADDR"),
        dbName: configService.get<string>("MONGO_DB"),
        auth: {
          username: configService.get<string>("MONGO_USERNAME"),
          password: configService.get<string>("MONGO_PASSWORD"),
        },
      }),
      inject: [ConfigService],
      connectionName: "users",
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>("MONGO_ADDR"),
        dbName: configService.get<string>("MONGO_DB"),
        auth: {
          username: configService.get<string>("MONGO_USERNAME"),
          password: configService.get<string>("MONGO_PASSWORD"),
        },
      }),
      inject: [ConfigService],
      connectionName: "tokens",
    }),

    AuthModule,
  ],
  controllers: [],
})
export class AppModule {}
