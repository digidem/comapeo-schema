# @comapeo/schema

JSON Schema and TypeScript types for CoMapeo.

Original draft: https://hackmd.io/wlMcMM65TmuPXGYOEbOR2g#

## Table of Contents

- [Install](#install)
- [Usage](#usage)
- [API](#api)
- [Maintainers](#maintainers)
- [License](#license)

## Install

```sh
npm install --save @comapeo/schema
```

## Usage

### JS validation functions

```js
import { validate } from '@comapeo/schema'

const testObservation = {
  /* ... */
}

const isValid = validate('observation', testObservation)
// returns true if validates against schema, false otherwise.
```

### TypeScript types

```typescript
import type { Observation } from '@comapeo/schema'

const myObs: Observation = {
  /* ... */
}
```

## API

## Adding new values

- Find the JSON schema inside `schemas/{name}/v1.json`
- Add your fields with descriptions
- Update the corresponding protocol buffer schema inside `proto/{name}/v1.proto`
- Add the new field to `src/lib/decode-conversions.js` and `src/lib/encode-conversions.js`
- Add the field to `test/fixtures/good-docs-completed.js`
- If there is extra validation happening add a failing doc to `test/fixtures/bad-docs.js`
- Run `npm run test` and make sure tests and linting pass

## Maintainers

[@digidem](https://github.com/digidem)

## License

MIT © 2024 Awana Digital
