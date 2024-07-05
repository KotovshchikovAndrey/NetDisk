import { Component } from "@angular/core";

interface IResource {
  name: string;
  ownerName: string;
  updatedAt: string;
  size: string;
}

@Component({
  selector: "app-disk",
  standalone: true,
  imports: [],
  templateUrl: "./disk.component.html",
  styleUrl: "./disk.component.css",
})
export class DiskComponent {
  resources: IResource[] = [];

  constructor() {
    for (let index = 0; index < 10; index++) {
      const now = new Date(Date.now());
      this.resources.push({
        name: index !== 0 ? `Новая папка (${index})` : "Новая папка",
        ownerName: "Andrey",
        updatedAt: `${now.getDay()} мая ${now.getFullYear()} г.`,
        size: "100 МБ",
      });
    }
  }
}
