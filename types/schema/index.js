import Ajv from 'ajv'
import addFormats from 'ajv-formats'

export { Observation } from './observation'

const createAjv = () => addFormats(new Ajv({}), ['date-time', 'time', 'date'])
const ajv = createAjv()
export const isValid = (t) => ajv.compile(t)
