# mapeo-schema

[![Build Status](https://img.shields.io/travis/digidem/mapeo-schema.svg)](https://travis-ci.org/digidem/mapeo-schema)
[![npm](https://img.shields.io/npm/v/mapeo-schema.svg)](https://www.npmjs.com/package/mapeo-schema)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?maxAge=2592000)](http://standardjs.com/)

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
