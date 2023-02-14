/**
 * Format schema type string to match protobuf/schema prefix type lookups
 * @param {String} str
 * @returns {String} First letter capitalized, the rest lowercased
 */
export const formatSchemaType = (str) =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
