import { NgIf } from "@angular/common"
import { Component, input } from "@angular/core"

@Component({
  selector: "app-loader",
  standalone: true,
  imports: [NgIf],
  templateUrl: "./loader.component.html",
  styleUrl: "./loader.component.css",
})
export class LoaderComponent {
  readonly isLoading = input<boolean>(false)
}
