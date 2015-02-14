
// Load some modules which are installed through NPM.
var gulp = require('gulp');
var browserify = require('browserify');  // Bundles JS.
var del = require('del');  // Deletes files.
var reactify = require('reactify');  // Transforms React JSX to JS.
var es6ify = require('es6ify'); //Transforms ES6 to ES5
var source = require('vinyl-source-stream');
var stylus = require('gulp-stylus');  // To compile Stylus CSS.

// Define some paths.
var paths = {
  src: {
    css: ['./src/css/**/*.styl', 'src/css/**/*.css'],
    js: ['./src/js/*.js', './src/js/*.jsx'], //Src JS files on which to watch
    app_js: ['./src/js/app.jsx'], //Main JS file, browserify finds the deps
  },
  dest: {
    css: './public/css',
    js: './public/js',
  }
};

// An example of a dependency task, it will be run before the css/js tasks.
// Dependency tasks should call the callback to tell the parent task that
// they're done.
gulp.task('clean:css', function(done) {
  del([paths.dest.css], done);
});

gulp.task('clean:js', function(done) {
  del([paths.dest.js], done);
});

// Our CSS task. It finds all our Stylus files and compiles them.
gulp.task('css', ['clean:css'], function() {
  return gulp.src(paths.src.css)
    .pipe(stylus())
    .pipe(gulp.dest(paths.dest.css));
});

// Our JS task. It will Browserify our code and compile React JSX files.
gulp.task('js', ['clean:js'], function() {
  // Browserify/bundle the JS.
  return browserify(es6ify.runtime)
    .transform(reactify)
    .transform(es6ify.configure(/.jsx/))
    .add(paths.src.app_js)
    .bundle()
    .pipe(source('bundle.js'))
    //.pipe(streamify(uglify()))
    .pipe(gulp.dest(paths.dest.js));
});

// Rerun tasks whenever a file changes.
gulp.task('watch', function() {
  gulp.watch(paths.src.css, ['css']);
  gulp.watch(paths.src.js, ['js']);
});

// The default task (called when we run `gulp` from cli)
gulp.task('default', ['watch', 'css', 'js']);
