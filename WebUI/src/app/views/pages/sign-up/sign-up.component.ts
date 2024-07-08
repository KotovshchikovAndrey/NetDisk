import { Component, signal } from "@angular/core"
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms"
import { AuthService } from "../../../data/services/auth.service"
import { ErrorMapper } from "../../../helpers/errors/error.mapper"
import { Router } from "@angular/router"
import { NgIf } from "@angular/common"
import { LoaderComponent } from "../../components/loader/loader.component"
import { finalize } from "rxjs"
import { HttpErrorResponse } from "@angular/common/http"

@Component({
  selector: "app-sign-up",
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, LoaderComponent],
  templateUrl: "./sign-up.component.html",
  styleUrl: "./sign-up.component.css",
})
export class SignUpComponent {
  readonly form = new FormGroup({
    name: new FormControl<string | null>(null, [
      Validators.required,
      this.validateNameFormat,
    ]),

    email: new FormControl<string | null>(null, [
      Validators.required,
      Validators.email,
    ]),

    password: new FormControl<string | null>(null, [Validators.required]),

    confirmPassword: new FormControl<string | null>(null),
  })

  readonly isLoading = signal<boolean>(false)
  readonly errorMessage = signal<string>("")
  readonly isShowPassword = signal<boolean>(false)

  constructor(
    private readonly authService: AuthService,
    private readonly errorMapper: ErrorMapper,
    private readonly router: Router,
  ) {
    this.form.valueChanges.subscribe(() => this.errorMessage.set(""))
  }

  toggleShowPassword() {
    this.isShowPassword.set(!this.isShowPassword())
  }

  submitForm() {
    if (this.form.valid) {
      const password = this.form.controls.password.value
      const confirmPassword = this.form.controls.confirmPassword.value

      if (password !== confirmPassword) {
        this.errorMessage.set("Пароли не совпадают")
        return
      }

      this.isLoading.set(true)
      this.authService
        // @ts-ignore
        .signUp(this.form.value)
        .pipe(finalize(() => this.isLoading.set(false)))
        .subscribe({
          next: () => this.router.navigateByUrl("/sign-in"),
          error: (err: HttpErrorResponse) => {
            console.log(err.error)
            this.errorMessage.set(
              this.errorMapper.getErrorMessage(err.error?.code),
            )
          },
        })
    }
  }

  private validateNameFormat(control: AbstractControl) {
    if (!control.value) {
      return null
    }

    const value = control.value.trim().split(" ")
    // [name, surname].length === 2
    if (value.length !== 2) {
      return { nameFormat: true }
    }

    return null
  }
}
