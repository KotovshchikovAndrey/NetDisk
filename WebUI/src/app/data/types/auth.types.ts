import { IResponse } from "./base.types"

export interface ISignUpRequest {
  name: string
  email: string
  password: string
}

export interface ISignUpResponse extends IResponse<null> {}

export interface ISignInRequest {
  email: string
  password: string
}

type ISignInResponseData = {
  access_token: string
} | null

export interface ISignInResponse extends IResponse<ISignInResponseData> {}
