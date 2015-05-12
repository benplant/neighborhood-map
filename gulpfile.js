'use strict';

var gulp = require('gulp');
var jshint = require('gulp-jshint');
var del = require('del');
var watchify = require('watchify');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var uglifyify = require('uglifyify');

var buffer = require('vinyl-buffer');
var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var assign = require('lodash.assign');

// browserify options
var customOpts = {
    entries: ['./scripts/app.js'],
    debug: true
};
var opts = assign({}, watchify.args, customOpts);
var b = watchify(browserify(opts));

gulp.task('bundle', bundle); // run gulp bundle to bundle the javascript
b.on('update', bundle); // on any dependency update, runs the bundler
b.on('log', gutil.log); // output build logs to terminal

// add transformations here
b.transform({ global: true}, 'uglifyify');

function bundle() {
    return b.bundle()
        // log errors if they happen
        .on('error', gutil.log.bind(gutil, 'Browserify Error'))
        //Pass desired output filename to vinyl-source-stream
        .pipe(source('bundle.js'))
        // optional, remove if you don't need to buffer file contents
        .pipe(buffer())
        // optional, remove if you don't want sourcemaps
        .pipe(sourcemaps.init({loadMaps: true})) // loads map from browserify file
        // Add transformation tasks to the pipeline here.
        .pipe(sourcemaps.write('./')) // writes .map file
        .pipe(gulp.dest('./dist/scripts'));
}

// Clean all files out of the dist folder
gulp.task('clean', function (cb) {
    del(['dist/**/*'], cb);
});

// Lint JavaScript files with jshint
gulp.task('lint', function() {
    return gulp.src('./scripts/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('default', ['clean', 'bundle']);