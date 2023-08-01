import { type ProtoTypeNames } from '../proto/types.js'
import { type ValidSchemaDef } from '../types.js'

/**
 * Get the name of the type, e.g. `Observation_5` for schemaName `observation`
 * and schemaVersion `1`
 */
export function getProtoTypeName(schemaDef: ValidSchemaDef): ProtoTypeNames {
  return (capitalize(schemaDef.schemaName) +
    '_' +
    schemaDef.schemaVersion) as ProtoTypeNames
}

function capitalize<T extends string>(str: T): Capitalize<T> {
  return (str.charAt(0).toUpperCase() + str.slice(1)) as any
}
