export function omit<T extends object, K extends keyof T>(
  obj: T,
  keys: ReadonlyArray<K>
): Omit<T, K> {
  const toOmit = new Set<keyof T>(keys)

  const result: Partial<T> = {}

  for (const key in obj) {
    if (!Object.hasOwn(obj, key)) continue
    if (toOmit.has(key)) continue
    result[key] = obj[key]
  }

  return result as Omit<T, K>
}
