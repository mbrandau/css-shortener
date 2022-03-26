## [3.0.0](https://github.com/mbrandau/css-shortener/compare/v2.2.0...v3.0.0) (2022-03-26)


### ⚠ BREAKING CHANGES

* trigger breaking change

### Bug Fixes

* update semantic release config ([8d04b25](https://github.com/mbrandau/css-shortener/commit/8d04b25ed86f3b531bf8359e387e2de8d3b8de7b))

# Changelog

## 3.0.0 - 26/03/2022

  - **BREAKING:** rewrite library

## 2.1.0 - 10/09/2018

  - Move generation of new class names to a public function (`getNewClassName(className)`)

## 1.2.0 - 02/25/2018

  - ADD `ignorePrefix` and `trimIgnorePrefix` options to omit classes from being replaced
  - OPTIMIZE performance for #htmlStream()
  - FIX HTML RegExp (was too greedy)
  - FIX [#2: htmlStream() only working on attributes with multiple classes](https://github.com/mbrandau/css-shortener/issues/2)
  - ADD `html` command

## 1.1.1

  - FIX [#1: Exclude comments from CSS RegExp](https://github.com/mbrandau/css-shortener/issues/1)  
  [Thanks to *revo*](https://stackoverflow.com/a/48962872/5133130) from StackOverflow

## 1.1.0

  - ADD ability to import existing mappings
  - ADD html stream to replace class names with mappings

## 1.0.0
