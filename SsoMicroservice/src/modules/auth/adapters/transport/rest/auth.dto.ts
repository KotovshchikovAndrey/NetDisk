import { IsEmail, IsNotEmpty, MinLength } from "class-validator"

export class SignUpDto {
  @IsNotEmpty()
  name: string

  @IsEmail()
  email: string

  @IsNotEmpty()
  password: string
}

export class SignInDto {
  @IsEmail()
  email: string

  @IsNotEmpty()
  password: string
}

export class VerifyDto {
  @IsNotEmpty()
  @MinLength(6)
  code: string
}
