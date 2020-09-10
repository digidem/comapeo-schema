# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [2.0.2](https://github.com/digidem/mapeo-schema/compare/v2.0.1...v2.0.2) (2020-09-10)


### Bug Fixes

* Add missing helperText prop to manual flow types ([7721840](https://github.com/digidem/mapeo-schema/commit/7721840f7af8e41c30d6f2c9b5a9eb9fdfdd0119))



## [2.0.1](https://github.com/digidem/mapeo-schema/compare/v2.0.0...v2.0.1) (2020-09-08)


### Bug Fixes

* should not support number keys ([95647e4](https://github.com/digidem/mapeo-schema/commit/95647e42bb2f2324c45e31bac84961f337654ac2))



# [2.0.0](https://github.com/digidem/mapeo-schema/compare/v1.10.1...v2.0.0) (2020-09-08)


### Features

* export stricter types (moved from Mapeo Desktop code) ([a6c97f1](https://github.com/digidem/mapeo-schema/commit/a6c97f1729ac3514813d98f1005a650859c93e53))


* fix!: Remove label:LANG_CODE style properties ([1e80410](https://github.com/digidem/mapeo-schema/commit/1e804106eb8a6a6acef851e46e22583c970e2959))


### BREAKING CHANGES

* The schema has always defined the label, name and
placeholder properties as also supporting a prefix of `:LANG_CODE` where
LANG_CODE is the two-letter ISO language code.
This has never been used in any of the Mapeo apps, and the current
approach to translation is to load translations at runtime and keep
them separate to the preset definitions themselves.
This is a breaking change because it removes properties from the schema,
but for Mapeo Mobile and Desktop this should not break anything because
these properties were not used anyway.



## [1.10.1](https://github.com/digidem/mapeo-schema/compare/v1.10.0...v1.10.1) (2020-07-09)


### Bug Fixes

* Fix schema update ([dd85a3e](https://github.com/digidem/mapeo-schema/commit/dd85a3e2bd44d691b93a82eff3314115994fbe91))



# [1.10.0](https://github.com/digidem/mapeo-schema/compare/v1.9.0...v1.10.0) (2020-07-09)


### Features

* Add localized field ([2d66acd](https://github.com/digidem/mapeo-schema/commit/2d66acd2f9442619ed4504370ad9f6bb7703d74f))



# [1.9.0](https://github.com/digidem/mapeo-schema/compare/v1.8.0...v1.9.0) (2020-04-17)


### Features

* add `helperText` property to field definitions ([61d9757](https://github.com/digidem/mapeo-schema/commit/61d97572096e3cad7536214f6d00ef51c56b2638))



# [1.8.0](https://github.com/digidem/mapeo-schema/compare/v1.7.0...v1.8.0) (2019-11-12)


### Features

* Add 'deviceId' property to all elements ([#1](https://github.com/digidem/mapeo-schema/issues/1)) ([604aef6](https://github.com/digidem/mapeo-schema/commit/604aef631edbf0f5993f10f86ff32529b933089f))



# [1.7.0](https://github.com/digidem/mapeo-schema/compare/v1.6.0...v1.7.0) (2019-09-27)


### Features

* Add additionalFields property to presets (used by Mapeo Desktop) ([4a5edaa](https://github.com/digidem/mapeo-schema/commit/4a5edaa))



# [1.6.0](https://github.com/digidem/mapeo-schema/compare/v1.5.0...v1.6.0) (2019-09-12)


### Features

* Add filter type ([0fc8f5a](https://github.com/digidem/mapeo-schema/commit/0fc8f5a))



# [1.5.0](https://github.com/digidem/mapeo-schema/compare/v1.4.0...v1.5.0) (2019-07-24)


### Features

* Remove optional metadata option `location` from metadata ([cf5cf0d](https://github.com/digidem/mapeo-schema/commit/cf5cf0d))



# [1.4.0](https://github.com/digidem/mapeo-schema/compare/v1.3.0...v1.4.0) (2019-07-24)


### Bug Fixes

* Fix flow types from schema with definitions ([2c64d3a](https://github.com/digidem/mapeo-schema/commit/2c64d3a))


### Features

* Add additional optional metadata properties for position and position provider ([d37a158](https://github.com/digidem/mapeo-schema/commit/d37a158))



# [1.3.0](https://github.com/digidem/mapeo-schema/compare/v1.2.0...v1.3.0) (2019-07-16)


### Bug Fixes

* Fix preset examples to include required id ([fc1c79e](https://github.com/digidem/mapeo-schema/commit/fc1c79e))
* Update observation docs ([b3076e1](https://github.com/digidem/mapeo-schema/commit/b3076e1))


### Features

* Add field schema ([5f372bc](https://github.com/digidem/mapeo-schema/commit/5f372bc))
* Add ID to presets ([fc512f0](https://github.com/digidem/mapeo-schema/commit/fc512f0))



# [1.2.0](https://github.com/digidem/mapeo-schema/compare/v1.1.0...v1.2.0) (2019-07-12)


### Features

* Add preset schema ([c1d7875](https://github.com/digidem/mapeo-schema/commit/c1d7875))
* Make tests dynamic ([f1c5af8](https://github.com/digidem/mapeo-schema/commit/f1c5af8))



# [1.1.0](https://github.com/digidem/mapeo-schema/compare/v1.0.4...v1.1.0) (2019-06-25)


### Features

* Add types for known metadata values ([8dfeb1d](https://github.com/digidem/mapeo-schema/commit/8dfeb1d))



## [1.0.4](https://github.com/digidem/mapeo-schema/compare/v1.0.3...v1.0.4) (2019-04-25)


### Bug Fixes

* allow additional properties on metadata and tags ([92e19a3](https://github.com/digidem/mapeo-schema/commit/92e19a3))



## [1.0.3](https://github.com/digidem/mapeo-schema/compare/v1.0.2...v1.0.3) (2019-04-25)


### Bug Fixes

* flow type for observation.schemaVersion should be enum ([6c03621](https://github.com/digidem/mapeo-schema/commit/6c03621))



## [1.0.2](https://github.com/digidem/mapeo-schema/compare/v1.0.1...v1.0.2) (2019-04-25)


### Bug Fixes

* flow type for observation.type should be enum ([c66215d](https://github.com/digidem/mapeo-schema/commit/c66215d))



## [1.0.1](https://github.com/digidem/mapeo-schema/compare/v1.0.0...v1.0.1) (2019-04-25)


### Bug Fixes

* make attachment and ref id required ([35b0be7](https://github.com/digidem/mapeo-schema/commit/35b0be7))



# 1.0.0 (2019-04-18)
