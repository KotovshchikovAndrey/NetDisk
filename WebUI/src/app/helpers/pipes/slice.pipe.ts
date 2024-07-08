import { Pipe, PipeTransform } from "@angular/core"

@Pipe({
  name: "slice",
  standalone: true,
})
export class SlicePipe implements PipeTransform {
  transform(value: string, lengthLimit: number = 20) {
    return value.length > lengthLimit
      ? `${value.slice(0, lengthLimit)}...`
      : value
  }
}
