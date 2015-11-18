'use strict';

const registry = require('solis-registry');
const gulp = require('gulp');
const gi = new gulp.Gulp();

gi.registry(registry);

module.exports = gi;
