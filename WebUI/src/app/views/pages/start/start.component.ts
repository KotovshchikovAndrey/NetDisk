import { Component } from "@angular/core"
import { RouterLink, RouterOutlet } from "@angular/router"
import { SignInComponent } from "../sign-in/sign-in.component"
import { NavigationComponent } from "../../components/navigation/navigation.component"

@Component({
  selector: "app-start",
  standalone: true,
  imports: [RouterOutlet, RouterLink, NavigationComponent, SignInComponent],
  templateUrl: "./start.component.html",
  styleUrl: "./start.component.css",
})
export class StartComponent {
  isAuth = false
}
