import { AccessCodeObjective } from "@modules/auth/core/values/access.code"
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { HydratedDocument } from "mongoose"

export type UserDocument = HydratedDocument<UserModel>
export type TokenDocument = HydratedDocument<TokenModel>

@Schema({ collection: "users", versionKey: false })
export class UserModel {
  @Prop({ required: true, type: String })
  _id: string

  @Prop({ required: true })
  name: string

  @Prop({ required: true })
  email: string

  @Prop({ required: true })
  secret: string

  @Prop({ required: true })
  is_verified: boolean

  @Prop({ required: true })
  is_2a_enabled: boolean

  @Prop({ required: true })
  created_at: Date

  @Prop({ required: true })
  last_login_at: Date

  @Prop({ required: true })
  hashed_password: string

  @Prop({ required: true, default: [] })
  access_codes: {
    code: string
    created_at: Date
    expired_at: Date
    objective: AccessCodeObjective
  }[]
}

@Schema({ collection: "tokens", versionKey: false })
export class TokenModel {
  @Prop({ required: true, type: String })
  _id: string

  @Prop({ required: true })
  created_at: Date

  @Prop({ required: true })
  expired_at: Date

  @Prop({ required: true })
  user_id: string

  @Prop({ required: true })
  device_id: string

  @Prop({ required: true })
  is_revoked: boolean
}

export const UserSchema = SchemaFactory.createForClass(UserModel)
export const TokenSchema = SchemaFactory.createForClass(TokenModel)
