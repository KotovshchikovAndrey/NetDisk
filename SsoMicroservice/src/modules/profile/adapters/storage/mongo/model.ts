import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document, SchemaTypes } from "mongoose"

export type SettingDocumet =
  | (ToggleSettingModel & Document)
  | (SingleSettingModel & Document)
  | (MultipleSettingModel & Document)

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
