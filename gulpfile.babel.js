'use strict';

const path = require('path');
const gulp = require('gulp');
const babel = require('gulp-babel');
const del = require('del');

var config = {
  src: 'src',
  dest: 'lib',
};

gulp.task('clean', () => {
  return del(config.dest);
});

gulp.task('compile', () => {
  return gulp.src(path.join(config.src, '**'), {
      dot: true
    })
    .pipe(babel({
      presets: ['es2015'],
    }))
    .pipe(gulp.dest(config.dest));
});

gulp.task('build', gulp.series('clean', 'compile'));
