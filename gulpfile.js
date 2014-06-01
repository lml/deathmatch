var gulp = require('gulp'),
    gutil = require('gulp-util'),
    coffee = require('gulp-coffee'),
    stylus = require('gulp-stylus'),
    nib = require('nib'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    jshint = require('gulp-jshint'),
    clean = require('gulp-clean'),
    connect = require('gulp-connect'),
    livereload = require('gulp-livereload'),
    size = require('gulp-size'),
    streamQueue = require('streamqueue'),
    vsource = require('vinyl-source-stream'),
    vtrans = require('vinyl-transform'),
    browserify = require('browserify'),
    exorcist = require('exorcist'),
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
    withBowerPaths(config, function(bowerPaths) {
        return streamQueue({objectMode: true},
            gulp.src(bowerPaths.jquery),
            gulp.src(bowerPaths.underscore),
            gulp.src(bowerPaths.backbone),
            gulp.src(bowerPaths['backbone-associations']),
            gulp.src(bowerPaths.marionette[0]),
            gulp.src(bowerPaths.quill)
        )
            .pipe(concat('lib.js'))
            .pipe(gulp.dest(folders.dest + '/marionette/assets/js'));
      });
}

function marionetteApp(config) {
    var xify = config.live ? watchify : browserify;
    withBowerPaths(config, function(bowerPaths) {
        xify({
            entries: ['./' + folders.src + '/marionette/assets/js/app.js.coffee'],
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
                    exports: 'Marionette'
                },
                quill: {
                    path: bowerPaths.quill,
                    exports: 'quill'
                }
            }
        })
            .external([
                'jquery',
                'underscore',
                'backbone',
                'backbone_associations',
                'marionette',
                'quill'
            ])
            .bundle({debug: config.dev})
            .on('error', handleErrors)
        .pipe(vsource('app.js'))
        .pipe(vtrans(function () { return exorcist(folders.dest + '/marionette/assets/js/app.js.map'); }))
        .pipe(gulp.dest(folders.dest + '/marionette/assets/js'));
    });
}

function html(config) {
    gulp.src(folders.src + '/marionette/index.html')
        .pipe(gulp.dest(folders.dest + '/marionette'));
}

function runStylus(config) {
    gulp.src(folders.src + '/marionette/assets/css/main.styl')
        .pipe(stylus({
            errors: config.dev,
            compress: !config.dev,
            use: [nib()],
            import: ['nib']
        }))
        .pipe(gulp.dest(folders.dest + '/marionette/assets/css'));
}

function handleErrors() {

    var args = Array.prototype.slice.call(arguments);

    // Send error to notification center with gulp-notify
    notify.onError({
        title: "Compile Error",
        message: "<%= error.message %>"
    }).apply(this, args);

    // Keep gulp from hanging on this task
    this.emit('end');
}


function build(config) {
    marionetteLib(config);
    marionetteApp(config);
    runStylus(config);
    html(config);
}

gulp.task('serve', function () {
    build({live: true, dev: true});
});

gulp.task('dev', function () {
    build({live: false, dev: true});
});

gulp.task('prod', function () {
    build({live: false, dev: false});
});
