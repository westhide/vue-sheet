export function objectKeys<T extends Record<string | number | symbol, unknown>>(
  object: T
) {
  return <Array<keyof T>>Object.keys(object);
}
