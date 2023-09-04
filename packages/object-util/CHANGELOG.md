# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.7.0] - 2023-09-04

### Added

- a new `objectFind` function to find elements in an object

## [1.6.1] - 2023-07-12

### Fixed

- Import order not respected for some loaders

## [1.6.0] - 2023-06-28

### Changed

- Better support for both ESM and CommonJS

## [1.5.0] - 2023-03-14

### Added

- new option for `objectClean` that clean falthy values
- new `objectRemap` function that allow to create a new object from the key/value of the old object while applying modifications
- Tests to better support Arrays

### Changed

- Export previously internal types `BasiceObject` and `BasicObjectKeys`

### Fixed

- Missing JSDocs for the retuns

## [1.4.6] - 2023-02-22

### Fixed

- Handle arrays with empty elements

## [1.4.5] - 2022-12-08


### Fixed

- Typescript returning errors when object can contains undefined

## [1.4.4] - 2022-12-08

### Fixed

- Export being borked

## [1.4.3] - 2022-12-08

### Fixed

- 6be80cb2e135ac98c8a156f0c2bc93dc4cc170f6 Missing type declaration for some callback functions

### Changed 

- f515091ac58f309106dd06a86e9c6a011f90623d More clear comment

## [1.4.2] - 2021-09-29

### Fixed

- 9f608a52fc32447b6f839415f90cba85d4b1ca35 `Object.freeze` error with `objectClone`

### Changed 

- 7ce7daf75184249da62c521bcab75263d324f0b1 Updated Jest to 27

## [1.4.1] - 2021-09-29

### Changed

- b7b604e11f8fe8654de963822080269066de9c41 Used objectLoop instead of basic loops
- b7b604e11f8fe8654de963822080269066de9c41 Add JS modules support
- 3d02a29bc5a059f8e5f28640144870311dc3d449 Moved back to NPM from Yarn

## [1.4.0] - 2021-09-28

### Added

- cb97ded195963c1a9ec17f0085b3d195b344a91e new `objectOmit` function that allows you to remove items from an object

## [1.3.0] - 2021-09-21

### Added

- 4efb33c0cb243ddf26fb144ea6c6d5c3714ea6ae new `objectClean` cleanup `null`/`undefined` from an object (more in options)
- 4efb33c0cb243ddf26fb144ea6c6d5c3714ea6ae new `isObject` function that allows verify is your variable is an object

## [1.2.0] - 2021-05-21

### Added

- `objectValues` - this does the same thing has objectToArray but make the naming better

### Changed

- `objectLoop` and `objectMap` now include an index after the key

### Deprecated

- `objectToArray` has been renamed to `objectValues`

## [1.1.1] - 2021-04-11

### Added

- objectSort parameter second parameter can now ba an array of keys


## [1.0.5] - 2021-02-08

### Changed
- Renamed cloneObject to objectClone

### Deprecated
- cloneObject function

## [1.0.4] - 2020-11-23

### Added

- Code Documentation
- objectKey function

### Changed

- (cloneObject): Changed internal typing
- (objectLoop): Made the stop check lighter

### Fixed

- (objectEqual): Fixed bug where object2 was larger and still returning true

## [1.0.2] - 2020-10-20

### Changed
- Dependencies

## [1.0.1] - 2020-09-11

### Fixed
- Main file error

## [1.0.0] - 2020-09-11

### Added
- objectMap Function
- objectLoop Function
- objectToArray Function
- objectSize Function
- objectSort Function
- cloneObject Function
- objectSet Function
- objectEqual Function


[1.2.0]: https://github.com/dzeiocom/libs/releases/tag/%40dzeio%2Fobject-util%401.2.0
[1.1.1]: https://github.com/dzeiocom/libs/releases/tag/%40dzeio%2Fobject-util%401.1.1
[1.0.5]: https://github.com/dzeiocom/libs/releases/tag/%40dzeio%2Fobject-util%401.0.5
[1.0.4]: https://github.com/dzeiocom/libs/releases/tag/%40dzeio%2Fobject-util%401.0.4
[1.0.2]: https://github.com/dzeiocom/libs/releases/tag/%40dzeio%2Fobject-util%401.0.2
[1.0.1]: https://github.com/dzeiocom/libs/releases/tag/%40dzeio%2Fobject-util%401.0.1
[1.0.0]: https://github.com/dzeiocom/libs/releases/tag/%40dzeio%2Fobject-util%401.0.0
