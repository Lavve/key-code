'use strict';

const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const gulpif = require('gulp-if');
const path = require('path');
const replace = require('gulp-replace');
const del = require('del');
const flatMap = require('flat-map').default;

const scaleImages = require('gulp-scale-images');

const sass = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
sass.compiler = require('node-sass');

const concat = require('gulp-concat');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');

const dev = process.argv[4] === 'development';

const conf = {
  dev: {
    js: './dev/js/',
    css: './dev/scss/',
    fonts: './public/webfonts/',
  },
  pub: {
    js: './public/js/',
    css: './public/css/',
    fonts: './public/webfonts/',
  },
};

gulp.task('delete-css', function () {
  return del([conf.pub.css + '*'], {
    force: true,
  });
});

gulp.task('delete-js', function () {
  return del([conf.pub.js + '*'], {
    force: true,
  });
});

gulp.task('delete-fonts', function () {
  return del([conf.pub.fonts + '*'], {
    force: true,
  });
});

gulp.task(
  'styles',
  gulp.series('delete-css', function () {
    return gulp
      .src([conf.dev.css + 'styles.scss'])
      .pipe(gulpif(dev, sourcemaps.init({ loadMaps: true })))
      .pipe(sass({ includePaths: ['scss'] }).on('error', sass.logError))
      .pipe(cleanCSS())
      .pipe(autoprefixer({}))
      .pipe(gulpif(dev, sourcemaps.write('.')))
      .pipe(gulp.dest(conf.pub.css));
  })
);

gulp.task(
  'scripts',
  gulp.series('delete-js', function () {
    var webpackConfig = Object.create(require('./webpack.config.js'));
    return gulp
      .src([conf.dev.js + 'App.js'])
      .pipe(webpackStream(webpackConfig, webpack))
      .pipe(concat('scripts.js'))
      .pipe(gulp.dest(conf.pub.js));
  })
);

gulp.task(
  'fonts',
  gulp.series('delete-fonts', function () {
    return gulp.src(['node_modules/poppins-font/files/*']).pipe(gulp.dest(conf.pub.fonts));
  })
);

gulp.task('version', function () {
  const version = (Math.random() + 1).toString(36).substring(5);
  console.log('\u001b[' + 33 + 'm VERSION: ' + version + '\u001b[0m');
  return gulp
    .src('./index.html')
    .pipe(replace(/\"(.*)\.(js|css)\?(v=[a-z0-9]{3,8})\"/g, '"$1.$2?v=' + version + '"'))
    .pipe(replace(/\"(.*)\.(js|css)\"/g, '"$1.$2?v=' + version + '"'))
    .pipe(gulp.dest('./'));
});

gulp.task('html', function () {
  return gulp
    .src('./index.html')
    .pipe(replace(/public\//g, ''))
    .pipe(gulp.dest('./public/'));
});

gulp.task('watchers', function () {
  gulp.watch([conf.dev.css + '**/*.scss'], gulp.series(['version', 'styles']));
  gulp.watch([conf.dev.js + '**/*.js'], gulp.series(['version', 'scripts']));
  gulp.watch([conf.dev.fonts + '/**/*'], gulp.series(['fonts']));
});

gulp.task('default', gulp.series(['styles', 'scripts', 'fonts', 'version', 'html']));
gulp.task('build', gulp.series(['styles', 'scripts', 'fonts', 'version', 'html']));
gulp.task('watch', gulp.series('watchers'));
