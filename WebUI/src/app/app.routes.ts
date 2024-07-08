import { Routes } from "@angular/router"
import { DriveComponent } from "./views/pages/drive/drive.component"
import { StartComponent } from "./views/pages/start/start.component"
import { DiskComponent } from "./views/pages/disk/disk.component"
import { AccountComponent } from "./views/pages/account/account.component"
import { CartComponent } from "./views/pages/cart/cart.component"
import { FavoriteComponent } from "./views/pages/favorite/favorite.component"
import { HelpComponent } from "./views/pages/help/help.component"
import { SearchComponent } from "./views/pages/search/search.component"
import { SharedAccessComponent } from "./views/pages/shared-access/shared-access.component"
import { SignInComponent } from "./views/pages/sign-in/sign-in.component"
import { isAuthGuard, isNotAuthGuard } from "./helpers/guards/auth.guard"
import { SignUpComponent } from "./views/pages/sign-up/sign-up.component"

export const routes: Routes = [
  { path: "", component: StartComponent },
  {
    path: "drive",
    component: DriveComponent,
    canActivate: [isAuthGuard],
    children: [
      { path: "", pathMatch: "full", redirectTo: "disk" },
      { path: "disk", component: DiskComponent },
      { path: "account", component: AccountComponent },
      { path: "cart", component: CartComponent },
      { path: "favorite", component: FavoriteComponent },
      { path: "search", component: SearchComponent },
      { path: "help", component: HelpComponent },
      { path: "shared", component: SharedAccessComponent },
    ],
  },
  {
    path: "sign-up",
    component: SignUpComponent,
    canActivate: [isNotAuthGuard],
  },
  {
    path: "sign-in",
    component: SignInComponent,
    canActivate: [isNotAuthGuard],
  },
  { path: "**", redirectTo: "drive" },
]
