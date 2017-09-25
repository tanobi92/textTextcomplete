/**
 * Created by namld9 on 04/07/2017.
 */
// --- INIT
const
    path         = require('path'),
// gulp
    gulp         = require('gulp'),
    less         = require('gulp-less'), // compiles less to CSS
    autoprefix   = require('gulp-autoprefixer'), // CSS browser compatibility
    cssmin       = require('gulp-clean-css'), // minifies CSS
    concat       = require('gulp-concat'),
    uglify       = require('gulp-uglify'), // minifies JS
    rename       = require('gulp-rename')
// // server
//     nodemon      = require('gulp-nodemon'),
//     livereload   = require('gulp-livereload'),
//     notifier     = require('node-notifier');
// browserify goodies
var browserify   = require('browserify'),
    babelify     = require('babelify'),
    partialify   = require('partialify'),
    buffer       = require('vinyl-buffer'),
    source       = require('vinyl-source-stream');
    sourcemaps   = require('gulp-sourcemaps');


// Paths variables
var paths = {
    'src': './src/',
    'public': {
        'css'              : './public/css/',
        'js'               : './public/js/'
    }

};

var mix = {
    /**
     * Get a standard Browserify stream.
     *
     * @param {string|array} src
     * @param {object}       options
     */
    browserify: function (src, options) {
        var stream = browserify(src, options);

        stream.transform(babelify, { stage: 0 });
        stream.transform(partialify);

        return stream.bundle();
    }
};

// --- TASKS INDEX
/*
 less
 less:bootstrap
 js
 js:bower_components
 js:browserify
 reload
 reload:browser
 reload:server
 watch
 watch:bootstrap
 watch:bower_components
 watch:browserify
 default
 */
// --- TASKS INDEX



// --- TASKS
// JS bower_components
// gulp.task('js:bundle', function() {
//     mix.browserify(paths.resources.js+'/weather.js')
//         .pipe(source('app.weather.js'))
//         .pipe(buffer())
//         .pipe(sourcemaps.init({loadMaps: true}))
//         //.pipe(uglify())
//         .pipe(sourcemaps.write('./'))
//         .pipe(gulp.dest(paths.public.js)); // destination: /public/javascripts/app.fileCustom.js
// });
// gulp.task('watch:bundle', function() {
//     gulp.watch(
//         [
//             'package.json',
//             paths.resources.vue+'*.js',
//             paths.resources.vue+'**/*.js',
//             paths.resources.vue+'**/*.html',
//             paths.resources.vue+'**/*.vue',
//         ],
//         ['js:bundle']);                              // run parallel gulp tasks on change
// });


// --- RELOAD
/**
 * Reload: Livereload
 */
gulp.task('reload:browser', function(){
    var options = {
        // base will check changes on 'public' folder
        base: "public"
    };
    livereload.listen(options);
    gulp.watch([
        'public/**/*.html',
        'public/**/*.css',
        'public/javascripts/app.browserify.js',
        'public/javascripts/bower_components.min.js',
    ])
        .on('change', function(event){
            livereload.changed(event);
            notifier.notify({ message: timer.lapse()+': Browser refreshed' });
        });
});

/**
 * Reload: Node server
 */
gulp.task('reload:server', function(){
    nodemon({
        script: './bin/www',    // script to start the server
        ext: 'js, hbs',         // file type to watch, for example *.js, *.hbs
        watch: [
            'bin/www',          // server script
            'app.js',           // app script
            'views',            // hbs files
            'routes'            // routes
        ]})
        .on('change', function (event) {
            notifier.notify({ message: timer.lapse()+': Node CHANGE: '+event });
        })
        .on('start', function (event) {
            notifier.notify({ message: timer.lapse()+': Node start' });
            setTimeout(function(){
                livereload.changed('/');
                notifier.notify({ message: timer.lapse()+': Livereload: Node start' });
            }, 1000);
        })
        .on('restart', function (event) {
            notifier.notify({ message: timer.lapse()+': Node restarted' });
            setTimeout(function(){
                livereload.changed('/');
                notifier.notify({ message: timer.lapse()+': Livereload: Node restart' });
            }, 1000);
        });
});
gulp.task('main', function() {
    mix.browserify(paths.src+'/main.js')
        .pipe(source('app.main.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        //.pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(paths.public.js)); // destination: /public/javascripts/app.fileCustom.js
});
// --- COMBINED TASKS
gulp.task('js',     ['js:bundle']);
gulp.task('reload', ['reload:server', 'reload:browser']);
gulp.task('watch',  ['watch:bundle']);
// gulp.task('export', ['less', 'js']);

// --- DEFAULT
// When you run only with: `gulp`
// gulp.task('default', ['watch', 'export']);