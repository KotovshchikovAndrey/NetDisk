import { Injectable } from "@angular/core"
import { errorCodes } from "./error.codes"

@Injectable({
  providedIn: "root",
})
export class ErrorMapper {
  getErrorMessage(errorCode?: string | null) {
    if (!errorCode) {
      return <string>errorCodes.get("ERR_INTERNAL")
    }

    const errorMessage = errorCodes.get(errorCode)
    if (!errorMessage) {
      return <string>errorCodes.get("ERR_INTERNAL")
    }

    return errorMessage
  }
}
