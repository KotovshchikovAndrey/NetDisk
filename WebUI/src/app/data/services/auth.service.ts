import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import {
  ISignInRequest,
  ISignInResponse,
  ISignUpRequest,
  ISignUpResponse,
} from "../types/auth.types"
import { tap } from "rxjs"

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private readonly baseUrl = "http://127.0.0.1:3000/auth"
  private _isAuth = false

  constructor(private readonly http: HttpClient) {}

  signUp(data: ISignUpRequest) {
    const url = `${this.baseUrl}/sign-up`
    return this.http.post<ISignUpResponse>(url, data, { withCredentials: true })
  }

  signIn(data: ISignInRequest) {
    const url = `${this.baseUrl}/sign-in`
    return this.http
      .post<ISignInResponse>(url, data, { withCredentials: true })
      .pipe(
        tap(
          (response) =>
            response.data &&
            localStorage.setItem("token", response.data.access_token),
        ),
      )
  }

  get isAuth() {
    if (!this._isAuth) {
      const token = localStorage.getItem("token")
      this._isAuth = !!token
    }

    return this._isAuth
  }
}
