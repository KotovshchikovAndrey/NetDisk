import { Routes } from "@angular/router";
import { HomeComponent } from "./pages/home/home.component";
import { DiskComponent } from "./pages/disk/disk.component";

export const routes: Routes = [
  { path: "", component: DiskComponent },
  { path: "favorite", component: HomeComponent },
  { path: "**", redirectTo: "" },
];
