import path from 'path'

/** @param {string} str */
export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const PROJECT_ROOT = path.resolve(
  path.dirname(new URL(import.meta.url).pathname),
  '../..'
)
