import { Component, OnInit } from "@angular/core"
import { RouterOutlet } from "@angular/router"
import { CookieService } from "ngx-cookie-service"

@Component({
  selector: "app-root",
  standalone: true,
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
  imports: [RouterOutlet],
})
export class AppComponent implements OnInit {
  readonly title = "web-ui"

  constructor(private readonly cookieService: CookieService) {}

  ngOnInit(): void {
    const deviceId = this.cookieService.get("device_id")
    if (!deviceId) {
      this.cookieService.set("device_id", "someDeviceId")
    }
  }
}
