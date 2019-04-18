# mapeo-schema

> Document schemas, validators and flow types for Mapeo

Original draft: https://hackmd.io/wlMcMM65TmuPXGYOEbOR2g#

## Table of Contents

- [Install](#install)
- [Usage](#usage)
- [API](#api)
- [Maintainers](#maintainers)
- [Contributing](#contributing)
- [License](#license)

## Install

```sh
npm install --save mapeo-schema
```

## Usage

### JS validation functions

```js
const mapeoSchema = require('mapeo-schema')
// also
const validateObservation = require('mapeo-schema/validateObservation')

const testObservation = {...}

const isValid = mapeoSchema.validateObservation(testObservation);
// returns true if validates against schema, false otherwise.
// errors a static prop on mapeoSchema.validateObservation.errors
```

### Flow types

```js
import type { Observation } from 'mapeo-schema'

const myObs: Observation = {...}
```

## API

## Maintainers

[@digidem](https://github.com/digidem)

## Contributing

PRs accepted.

## License

MIT © 2019 Digital Democracy
