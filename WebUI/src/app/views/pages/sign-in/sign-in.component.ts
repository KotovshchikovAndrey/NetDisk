import { NgIf } from "@angular/common"
import { Component, signal } from "@angular/core"
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms"
import { AuthService } from "../../../data/services/auth.service"
import { HttpErrorResponse } from "@angular/common/http"
import { ErrorMapper } from "../../../helpers/errors/error.mapper"
import { finalize } from "rxjs"
import { Router } from "@angular/router"
import { LoaderComponent } from "../../components/loader/loader.component"

@Component({
  selector: "sign-in",
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, LoaderComponent],
  templateUrl: "./sign-in.component.html",
  styleUrl: "./sign-in.component.css",
})
export class SignInComponent {
  readonly form = new FormGroup({
    email: new FormControl<string | null>(null, [
      Validators.required,
      Validators.email,
    ]),

    password: new FormControl<string | null>(null, [Validators.required]),
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
    if (this.form.valid && !this.errorMessage()) {
      this.isLoading.set(true)
      this.authService
        // @ts-ignore
        .signIn(this.form.value)
        .pipe(finalize(() => this.isLoading.set(false)))
        .subscribe({
          next: () => this.router.navigateByUrl("/drive"),
          error: (err: HttpErrorResponse) =>
            this.errorMessage.set(
              this.errorMapper.getErrorMessage(err.error?.code),
            ),
        })
    }
  }
}
