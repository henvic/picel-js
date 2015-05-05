'use strict';

var paths,
    fs = require('fs'),
    gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    jscs = require('gulp-jscs'),
    mocha = require('gulp-mocha'),
    istanbul = require('gulp-istanbul'),
    complexity = require('gulp-complexity'),
    runSequence = require('run-sequence'),
    open = require('open'),
    help = require('./tasks/help');

paths = {
    lint: [
        'test/**/*.js', 'tasks/**/*.js', '*.js'
    ],
    complexity: ['test/**/*.js', 'tasks/**/*.js', '*.js'],
    cover: ['picel.js'],
    unit: ['test/**/*.js', '!test/fixture/*.js'],
    watch: ['picel.js'],
    'coverage-report-directory': 'reports/coverage',
    'coverage-report': 'reports/coverage/lcov-report/index.html'
};

function lintTask() {
    return gulp.src(paths.lint)
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter('fail'))
        .pipe(jscs());
}

function complexityTask() {
    return gulp.src(paths.complexity)
        .pipe(complexity({
            halstead: 29,
            cyclomatic: 17
        }));
}

function coverTask() {
    return gulp.src(paths.cover)
        .pipe(istanbul({includeUntested: true}))
        .pipe(istanbul.hookRequire());
}

function mochaTest() {
    return gulp.src(paths.unit)
        .pipe(mocha());
}

function unitTask() {
    return mochaTest()
        .pipe(istanbul.writeReports({
            reporters: ['lcov', 'json'],
            dir: paths['coverage-report-directory']
        }));
}

function unitCiTask() {
    return mochaTest()
        .pipe(istanbul.writeReports({
            dir: paths['coverage-report-directory']
        }));
}

function testTask(done) {
    return runSequence(
        'lint',
        'complexity',
        'unit',
        done
    );
}

function ciTask(done) {
    return runSequence(
        'lint',
        'complexity',
        'unit-ci',
        done
    );
}

function coverageReportTask() {
    var file = paths['coverage-report'];

    if (!fs.existsSync(file)) {
        console.error('Run gulp test first.');
        return;
    }

    open(file);
}

function watchTask() {
    return gulp.watch(paths.watch, ['test']);
}

gulp.task('default', help);
gulp.task('help', help);
gulp.task('lint', lintTask);
gulp.task('complexity', complexityTask);
gulp.task('test-cover', coverTask);
gulp.task('unit', ['test-cover'], unitTask);
gulp.task('unit-ci', ['test-cover'], unitCiTask);
gulp.task('test', testTask);
gulp.task('ci', ciTask);
gulp.task('coverage-report', coverageReportTask);
gulp.task('watch', watchTask);
