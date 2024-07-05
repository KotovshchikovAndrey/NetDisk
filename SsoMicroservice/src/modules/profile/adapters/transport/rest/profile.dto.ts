import { IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator"

export class ChangeProfileFieldsDto {
  @IsString()
  @IsOptional()
  name?: string
}
