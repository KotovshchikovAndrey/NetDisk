import { inject } from "@angular/core"
import { AuthService } from "../../data/services/auth.service"
import { Router } from "@angular/router"

export const isAuthGuard = () => {
  const authService = inject(AuthService)
  if (!authService.isAuth) {
    const router = inject(Router)
    router.navigateByUrl("/sign-in")
  }

  return authService.isAuth
}

export const isNotAuthGuard = () => {
  const authService = inject(AuthService)
  if (authService.isAuth) {
    const router = inject(Router)
    router.navigateByUrl("/drive")
  }

  return !authService.isAuth
}
