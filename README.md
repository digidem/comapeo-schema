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

## Maintainers

[@digidem](https://github.com/digidem)

## License

MIT © 2024 Awana Digital
