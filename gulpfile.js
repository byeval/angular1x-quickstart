const gulp = require('gulp')
const plumber = require('gulp-plumber')
const notify = require('gulp-notify')
const del = require('del')
const uglify = require('gulp-uglify')
const ngAnnotate = require('gulp-ng-annotate')
const concat = require('gulp-concat')
const templateCache = require('gulp-angular-templatecache')
const sourcemaps = require('gulp-sourcemaps')
const imagemin = require('gulp-imagemin')
const RevAll = require('gulp-rev-all')
const revReplace = require('gulp-rev-replace')
const stylus = require('gulp-stylus')

const opt = {
    distFolder: 'asserts',
    backupFolder: 'backup'
}

// notify me if error emit
function errorNotify(error) {
    notify.onError("Error: <%= error.message %>")
    console.log(error.toString())
}

// convert stylus to css and minify css 
gulp.task('cssmin', () => {
    return gulp.src('stylus/**/*.styl')
        .pipe(plumber({
            errorHandle: errorNotify
        }))
        .pipe(stylus())
        .pipe(gulp.dest('build/css'))
})

// cache all angular template
gulp.task('templates', () => {
    return gulp.src('views/**/*.html')
        .pipe(templateCache('templates.js', {
            module: 'myApp.controller',
            standAlone: false
        }))
        .pipe(gulp.dest('build/js'))
})

// uglify js
gulp.task('jsmin', ['templates'], () => {
    return gulp.src([
            'src/app.js',
            'src/routes.js',
            'src/service/*.js',
            'src/controller/*.js',
            'build/js/templates.js'
        ])
        .pipe(sourcemaps.init())
        .pipe(plumber({
            errorHandle: errorNotify
        }))
        .pipe(ngAnnotate())
        .pipe(concat('main.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('build/js'))
})

gulp.task('libmin', () => {
    return gulp.src([
            'node_modules/angular/angular.js',
            'node_modules/angular-animate/angular-animate.js',
            'node_modules/angular-sanitize/angular-sanitize.js',
            'node_modules/angular-ui-router/build/angular-ui-router.js'
        ])
        .pipe(concat('lib.js'))
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(gulp.dest('build/js'))
})

// compose image
gulp.task('imagemin', () => {
    return gulp.src(['image'])
        .pipe(imagemin({
            optimizationLevel: 5
        }))
        .pipe(gulp.dest('asserts'))
})

// delete dist dirctory before revision
gulp.task('clean', ['default'], () => {
    return gulp.src(opt.distFolder + '/**')
        .pipe(gulp.dest(opt.backupFolder))
})

// reversion file
gulp.task('revision', ['clean'], () => {
    var revAll = new RevAll()
    return gulp.src(['build/**'])
        .pipe(revAll.revision())
        .pipe(gulp.dest(opt.distFolder))
        // .pipe(revAll.versionFile())
        .pipe(revAll.manifestFile())
        .pipe(gulp.dest(opt.distFolder))
})

// replace file after revision
gulp.task('revreplace', ['revision'], () => {
    var manifest = gulp.src('./' + opt.distFolder + '/rev-manifest.json')
    return gulp.src('app/index.html')
        .pipe(revReplace({
            manifest: manifest
        }))
        .pipe(gulp.dest('app'))
})

// rollback use backup manifest
gulp.task('restore', () => {
    return gulp.src(opt.backupFolder + '/**')
        .pipe(gulp.dest(opt.distFolder))
})

gulp.task('rollback', ['restore'], () => {
    var manifest = gulp.src('./' + opt.backupFolder + '/rev-manifest.json')
    return gulp.src('app/index.html')
        .pipe(revReplace({
            manifest: manifest
        }))
        .pipe(gulp.dest('app'))
})

// watch file change
gulp.watch('stylus/**/*.styl', ['cssmin'])
gulp.watch('views/**/*.html', ['templates'])
gulp.watch('src/**/*.js', ['jsmin', 'clean'])

gulp.task('build', ['cssmin', 'jsmin', 'libmin'])
gulp.task('deploy', ['imagemin', 'revreplace'])
gulp.task('default', ['build'])
