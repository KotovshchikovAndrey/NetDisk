import { Component } from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";

@Component({
  selector: "app-home",
  standalone: true,
  templateUrl: "./home.component.html",
  styleUrl: "./home.component.css",
  imports: [RouterLink, RouterLinkActive],
})
export class HomeComponent {
  greetMessage = "Welcome home!";
}
