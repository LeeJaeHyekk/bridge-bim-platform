// 개발 환경에서만 로그 출력
const isDev = import.meta.env.DEV

export function debugLog(...args: unknown[]): void {
  if (isDev) console.log(...args)
}
