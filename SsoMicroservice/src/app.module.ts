import { AuthModule } from "@modules/auth/auth.module"
import { ProfileModule } from "@modules/profile/profile.module"
import { Module } from "@nestjs/common"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { EventEmitterModule } from "@nestjs/event-emitter"
import { MongooseModule } from "@nestjs/mongoose"

@Module({
  imports: [
    EventEmitterModule.forRoot(),
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
      connectionName: "settings",
    }),

    // MongooseModule.forRootAsync({
    //   imports: [ConfigModule],
    //   useFactory: async (configService: ConfigService) => ({
    //     uri: configService.get<string>("MONGO_ADDR"),
    //     dbName: configService.get<string>("MONGO_DB"),
    //     auth: {
    //       username: configService.get<string>("MONGO_USERNAME"),
    //       password: configService.get<string>("MONGO_PASSWORD"),
    //     },
    //   }),
    //   inject: [ConfigService],
    //   connectionName: "profiles",
    // }),

    AuthModule,
    ProfileModule,
  ],
  controllers: [],
})
export class AppModule {}
