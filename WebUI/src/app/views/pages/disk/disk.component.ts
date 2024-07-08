import {
  AfterViewChecked,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  signal,
} from "@angular/core"
import { SlicePipe } from "../../../helpers/pipes/slice.pipe"

interface IResource {
  name: string
  ownerName: string
  updatedAt: string
  size: string
}

@Component({
  selector: "app-disk",
  standalone: true,
  templateUrl: "./disk.component.html",
  styleUrl: "./disk.component.css",
  imports: [SlicePipe],
})
export class DiskComponent implements AfterViewChecked, OnInit {
  @ViewChild("scrollContainer", { static: false })
  private readonly scrollContainer: ElementRef | undefined
  private isNeedScroll = false

  readonly resources = signal<IResource[]>([])

  ngOnInit(): void {
    for (let index = 0; index < 10; index++) {
      const resource = this.getNewResource()
      this.resources.update((resources) => {
        resources.push(resource)
        return resources
      })
    }
  }

  ngAfterViewChecked(): void {
    if (this.isNeedScroll) {
      this.scrollToBottom()
      this.isNeedScroll = false
    }
  }

  addFolder() {
    const newResource = this.getNewResource()
    this.resources.update((resources) => {
      resources.push(newResource)
      return resources
    })

    this.isNeedScroll = true
  }

  private scrollToBottom() {
    if (this.scrollContainer !== undefined) {
      const currentScroll = this.scrollContainer.nativeElement.scrollHeight
      this.scrollContainer.nativeElement.scrollTop = currentScroll
    }
  }

  private getNewResource(): IResource {
    const now = new Date(Date.now())
    const length = this.resources().length
    return {
      name: length !== 0 ? `Новая папка (${length})` : "Новая папка",
      ownerName: "Andrey",
      updatedAt: `${now.getDay()} мая ${now.getFullYear()} г.`,
      size: `${Math.floor(Math.random() * 1000)} MB`,
    }
  }
}
