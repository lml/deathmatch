var gulp = require('gulp'),
    gutil = require('gulp-util'),
    coffee = require('gulp-coffee'),
    stylus = require('gulp-stylus'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    plumber = require('gulp-plumber'),
    notify = require('gulp-notify'),
    jshint = require('gulp-jshint'),
    clean = require('gulp-clean'),
    inject = require('gulp-inject'),
    connect = require('gulp-connect'),
    livereload = require('gulp-livereload'),
    size = require('gulp-size'),
    streamQueue = require('streamqueue'),
    browserify = require('browserify'),
    watchify = require('watchify'),
    bower = require('bower');

var folders = {
    src: "src",
    dest: "www",
    tmp: "tmp",
    components: "bower_components",
    common: "common",
    projects: ['marionette', 'react']
};

/*
 * Clean destination folders.
 */
gulp.task('clean', function() {
    return gulp.src([
            folders.dest + '/assets/css',
            folders.dest + '/assets/js',
            folders.dest + '/assets/images', folders.dest],
            {read: false})
        .pipe(clean());
});

function withBowerPaths(config, cb) {
    bower.commands.list({
        paths: true
    }).on('end', cb);
}

/*
 *  Marionette build:
 *     - Concat JS files from common and marionette folder
 *       - jquery
 *       - backbone
 *       - underscore
 *       - marionette
 *       - associations
 *       - quill.js
 *       - common/entities
 *       - common/stubs
 *       - marionette/apps/editor
 *     - Preprocess and concat stylus style files
 *     - Deploy to destination
 */
function marionetteLib(config) {
    var xify = config.live ? watchify : browserify;
    withBowerPaths(config, function(bowerPaths) {
        xify({
            entries: [folders.src + '/marionette/assets/js/app.js.coffee'],
            extensions: ['.js', '.coffee'],
            shim: {
                jquery: {
                    path: bowerPaths.jquery,
                    exports: '$'
                },
                underscore: {
                    path: bowerPaths.underscore,
                    exports: '_'
                },
                backbone: {
                    path: bowerPaths.backbone,
                    exports: 'Backbone'
                },
                backbone_associations: {
                    path: bowerPaths.backbone_associations
                },
                marionette: {
                    path: bowerPaths.marionette[0],
                    exports: Marionette
                },
                quill: {
                    path: bowerPaths.quill,
                    exports: quill
                }
            }
        });
    });
}

// gulp.task('stylus', function() {
//     gulp.src(folders.src + '/common/assets/stylus/*.styl')
//         .pipe(plumber())
//         .pipe(stylus({
//             errors: true,
//             use: ['nib'],
//             import: ['nib']
//         }))
//         .pipe(gulp.dest(folders.dest + '/assets/css'));
// });

// gulp.task('m-lib', function() {
//     var bundleMethod =
//         gulp.src(folders.src + '/assets/stylus/*.styl')
//         .pipe(plumber())
//         .pipe(stylus({
//             errors: true,
//             use: ['nib'],
//             import: ['nib']
//         }))
//         .pipe(gulp.dest(folders.dest + '/assets/css'));
// });

// gulp.task('m-app', function() {
//     return streamQueue({
//         objectMode: true
//     }, gulp.src(''))
//     gulp.src(folders.src + '/assets/stylus/*.styl')
//         .pipe(plumber())
//         .pipe(stylus({
//             errors: true,
//             use: ['nib'],
//             import: ['nib']
//         }))
//         .pipe(gulp.dest(folders.dest + '/assets/css'));
// });

// gulp.task('r-lib', function() {
//     gulp.src(folders.src + '/assets/stylus/*.styl')
//         .pipe(plumber())
//         .pipe(stylus({
//             errors: true,
//             use: ['nib'],
//             import: ['nib']
//         }))
//         .pipe(gulp.dest(folders.dest + '/assets/css'));
// });

// gulp.task('r-app', function() {
//     gulp.src(folders.src + '/assets/stylus/*.styl')
//         .pipe(plumber())
//         .pipe(stylus({
//             errors: true,
//             use: ['nib'],
//             import: ['nib']
//         }))
//         .pipe(gulp.dest(folders.dest + '/assets/css'));
// });
