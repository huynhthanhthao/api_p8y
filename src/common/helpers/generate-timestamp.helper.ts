export function generateTimesTamp(): string {
  return Math.floor(Date.now() / 1000).toString()
}
