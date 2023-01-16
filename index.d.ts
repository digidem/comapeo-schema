import { validateCommon } from './lib/validateCommon.js';
import { validateField } from './lib/validateField.js';
import { validateFilter } from './lib/validateFilter.js';
import { validateObservation } from './lib/validateObservation.js';
import { validatePreset } from './lib/validatePreset.js';

export { validateCommon };
export { validateField };
export { validateFilter };
export { validateObservation };
export { validatePreset };

import CommonSchemaDef from './schema/common.json';
import FieldSchemaDef from './schema/field.json';
import FilterSchemaDef from './schema/filter.json';
import ObservationSchemaDef from './schema/observation.json';
import PresetSchemaDef from './schema/preset.json';

export type CommonSchema = typeof CommonSchemaDef;
export type FieldSchema = typeof FieldSchemaDef;
export type FilterSchema = typeof FilterSchemaDef;
export type ObservationSchema = typeof ObservationSchemaDef;
export type PresetSchema = typeof PresetSchemaDef;

export * from './types/Common';
export * from './types/Field';
export * from './types/Filter';
export * from './types/Observation';
export * from './types/Preset';
