var gulp = require('gulp'),
    gutil = require('gulp-util'),
    connect = require('connect'),
    static = require('serve-static'),
    livereload = require('gulp-livereload'),
    http = require('http'),
    coffee = require('gulp-coffee'),
    stylus = require('gulp-stylus'),
    nib = require('nib'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    jshint = require('gulp-jshint'),
    clean = require('gulp-clean'),
    plumber = require('gulp-plumber'),
    ghpush = require('gulp-gh-pages'),
    size = require('gulp-size'),
    streamQueue = require('streamqueue'),
    vsource = require('vinyl-source-stream'),
    vtrans = require('vinyl-transform'),
    browserify = require('browserify'),
    globalShim = require('browserify-global-shim'),
    exorcist = require('exorcist'),
    watchify = require('watchify'),
    wiredep = require('wiredep');

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
            folders.dest + '/assets/images',
            folders.dest + '/marionette/assets/css',
            folders.dest + '/marionette/assets/js',
            folders.dest + '/marionette/assets/images',
            folders.dest + '/react/assets/css',
            folders.dest + '/react/assets/js',
            folders.dest + '/react/assets/images',
            folders.dest
        ], {
            read: false
        })
        .pipe(clean());
});

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
    var bower = wiredep({
        exclude: [/lib\/backbone.marionette.js/, /react/]
    });
    gulp.src(bower.js)
        .pipe(concat('lib.js'))
        .pipe(gulp.dest(folders.dest + '/marionette/assets/js'));
}

function marionetteApp(config) {
    var xify = config.live ? watchify : browserify;
    var bundler = xify({
        entries: ['./' + folders.src + '/marionette/assets/js/app.js.coffee'],
        extensions: ['.js', '.coffee']
    });
    var bundle = function() {
        bundler
            .bundle({
                debug: config.dev
            })
            .on('error', handleErrors("Browserify error"))
            .pipe(vsource('app.js'))
            .pipe(vtrans(function() {
                return exorcist(folders.dest + '/marionette/assets/js/app.js.map');
            }))
            .pipe(gulp.dest(folders.dest + '/marionette/assets/js'));
    };
    if (config.live) {
        bundler.on('update', bundle);
    }
    bundle();
}

function reactLib(config) {
    var bower = wiredep({
        exclude: [/backbone.babysitter/, /backbone.wreqr/, /marionette/]
    });
    gulp.src(bower.js)
        .pipe(concat('lib.js'))
        .pipe(gulp.dest(folders.dest + '/react/assets/js'));
}

function reactApp(config) {
    var xify = config.live ? watchify : browserify;
    var bundler = xify({
        entries: ['./' + folders.src + '/react/assets/js/app.coffee'],
        extensions: ['.js', '.coffee']
    });
    var bundle = function() {
        bundler
            .bundle({
                debug: config.dev
            })
            .on('error', handleErrors("Browserify error"))
            .pipe(vsource('app.js'))
            .pipe(vtrans(function() {
                return exorcist(folders.dest + '/react/assets/js/app.map');
            }))
            .pipe(gulp.dest(folders.dest + '/react/assets/js'));
    };
    if (config.live) {
        bundler.on('update', bundle);
    }
    bundle();
}

var sourcePaths = {
    common: {
        html: folders.src + '/*.html',
        css: folders.src + '/common/assets/css/*.css',
        stylus: folders.src + '/common/assets/css/*.styl'
    },
    marionette: {
        html: folders.src + '/marionette/index.html',
        css: folders.src + '/marionette/assets/css/*.css',
        stylus: folders.src + '/marionette/assets/css/main.styl'
    },
    react: {
        html: folders.src + '/react/index.html',
        css: folders.src + '/react/assets/css/*.css',
        stylus: folders.src + '/react/assets/css/main.styl'
    }
};

function runHTML(config) {
  var html = function(part) {
    var dest = folders.dest;
    if (part !== 'common') {
      dest = dest + '/' + part;
    }
    dest = dest + '/';
    gulp.src(sourcePaths[part].html)
        .pipe(gulp.dest(dest));
  };
  html('common');
  html('marionette');
  html('react');
}

function runCSS(config) {
  var css = function(part) {
    var dest = folders.dest;
    if (part !== 'common') {
      dest = dest + '/' + part;
    }
    dest = dest + '/assets/css';
    gulp.src(sourcePaths[part].css)
        .pipe(gulp.dest(dest));
  };
  css('common');
  css('marionette');
  css('react');
}

function runStylus(config) {
  var styl = function(part) {
    var dest = folders.dest;
    if (part !== 'common') {
      dest = dest + '/' + part;
    }
    dest = dest + '/assets/css';
    gulp.src(sourcePaths[part].stylus)
    .pipe(plumber())
    .pipe(stylus({
        errors: config.dev,
        compress: !config.dev,
        use: [nib()],
        import: ['nib']
    }))
    .on("error", handleErrors("Stylus Error"))
    .pipe(gulp.dest(dest));
  };
  styl('common');
  styl('marionette');
  styl('react');
}

function handleErrors(title) {
    return function() {
      var args = Array.prototype.slice.call(arguments);

      // Send error to notification center with gulp-notify
      notify.onError({
          title: title,
          message: "<%= error.message %>"
      }).apply(this, args);
      console.log(args);

      // Keep gulp from hanging on this task
      this.emit('end');
      };
}

function build(config) {
    marionetteLib(config);
    marionetteApp(config);
    reactLib(config);
    reactApp(config);
    runStylus(config);
    runHTML(config);
    runCSS(config);
}

gulp.task('serve', function() {
    var conf = {
        live: true,
        dev: true
    };
    var server = connect(),
        reloader = livereload();

    var watchAndBuild = function(path, cb) {
        gulp.watch(path, {
            maxListeners: 999
        }, function() {
            console.log("File changed: " + path);
            cb(conf);
        });
    };
    watchAndBuild(sourcePaths.html, runHTML);
    watchAndBuild(sourcePaths.stylus, runStylus);
    build(conf);
    gulp.watch(folders.dest + "/**", {
        maxListeners: 999
    }, function(path) {
        reloader.changed(path);
    });
    var app = server.use(static(folders.dest));
    http.createServer(app).listen(8081);
});

gulp.task('dev', function() {
    build({
        live: false,
        dev: true
    });
});

gulp.task('prod', function() {
    build({
        live: false,
        dev: false
    });
});

gulp.task('ghpublish', function() {
    gulp.src("./www/**/*")
        .pipe(ghpush());
});
