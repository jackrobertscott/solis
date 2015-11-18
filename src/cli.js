'use strict';

const argv = require('minimist')(process.argv.slice(2));
const gi = require('..');

gi.start.call(gi, argv._);
