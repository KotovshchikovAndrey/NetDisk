export const camelToSnakeCase = (str: string) =>
  str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)

export const camelToSnakeCaseFields = <T>(obj: T) => {
  Object.getOwnPropertyNames(obj).forEach((field) => {
    if (field.toLowerCase() !== field) {
      obj[camelToSnakeCase(field)] = obj[field]
      delete obj[field]
    }
  })

  return obj
}
