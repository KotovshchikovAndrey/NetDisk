import { Component } from "@angular/core"
import { RouterOutlet } from "@angular/router"
import { NavigationComponent } from "../../components/navigation/navigation.component"

@Component({
  selector: "app-drive",
  standalone: true,
  imports: [RouterOutlet, NavigationComponent],
  templateUrl: "./drive.component.html",
  styleUrl: "./drive.component.css",
})
export class DriveComponent {}
