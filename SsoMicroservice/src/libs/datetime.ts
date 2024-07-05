export const getUtcNowDate = () => new Date(Date.now())

export const addTimeToDate = (date: Date, seconds: number) =>
  new Date(date.getTime() + seconds * 1000)

export const getCurrentTimestamp = () => Math.floor(Date.now() / 1000)
