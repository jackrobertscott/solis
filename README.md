# Solis

Static site server and generator with built-in preprocessing

### Support

**Markups**

- Html (.html)
- Nunjucks (.nunjucks)
- Jade (.jade)

Note: Jade and Nunjucks are supported because of their inheritance abilities.

The markups renderer also makes available any data from JSON (.json) files it finds in the source directory under the `base` locals variable. Each files data may be accessed via it's relative folder path. E.g. if a JSON file is stored in `{source directory}/example/path/\_data.json` then that folders data will be available from `base.example.path._data`.

**Styles**

- CSS (.css)
- Less (.less)
- SASS (.sass)
- SCSS (.scss)
- Stylus (.styl)

**Scripts**

- JavaScript
  - ES5 (.js)
  - ES6 (.es6)
- CoffeeScript (.coffee)

**Tests**

- Mocha?
