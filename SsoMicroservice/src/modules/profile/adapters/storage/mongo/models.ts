import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { HydratedDocument } from "mongoose"

export type SettingDocumet =
  | HydratedDocument<ToggleSettingModel>
  | HydratedDocument<SingleSettingModel>
  | HydratedDocument<MultipleSettingModel>

export type ProfileDocument = HydratedDocument<ProfileModel>
export type MySetting = MyToggleSetting | MySingleSetting | MyMultipleSetting

export type SettingModel =
  | ToggleSettingModel
  | SingleSettingModel
  | MultipleSettingModel

export type MyToggleSetting = {
  _id: string
  is_enabled: boolean
}

export type MySingleSetting = {
  _id: string
  selected_option: string
}

export type MyMultipleSetting = {
  _id: string
  selected_options: string[]
}

@Schema({ collection: "users", versionKey: false })
export class ProfileModel {
  @Prop({ required: true, type: String })
  _id: string

  @Prop({ required: true })
  name: string

  @Prop({ required: true })
  email: string

  @Prop({ required: true })
  is_verified: boolean

  @Prop({ required: true })
  is_2a_enabled: boolean

  @Prop({ required: false, select: false })
  my_settings?: MySetting[]

  @Prop({ required: false, select: false })
  settings?: SettingModel[]
}

@Schema({ collection: "settings", versionKey: false })
export class ToggleSettingModel {
  @Prop({ required: true, type: String })
  _id: string

  @Prop({ required: true })
  is_enabled: boolean
}

@Schema({ collection: "settings", versionKey: false })
export class SingleSettingModel {
  @Prop({ required: true, type: String })
  _id: string

  @Prop({ required: true })
  allowed_options: string[]

  @Prop({ required: true })
  selected_option: string
}

@Schema({ collection: "settings", versionKey: false })
export class MultipleSettingModel {
  @Prop({ required: true, type: String })
  _id: string

  @Prop({ required: true })
  allowed_options: string[]

  @Prop({ required: true, default: [] })
  selected_options: string[]
}

export const ToggleSettingSchema =
  SchemaFactory.createForClass(ToggleSettingModel)

export const SingleSettingSchema =
  SchemaFactory.createForClass(SingleSettingModel)

export const MultipleSettingSchema =
  SchemaFactory.createForClass(MultipleSettingModel)

export const ProfileSchema = SchemaFactory.createForClass(ProfileModel)
