var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var cleanCSS = require('gulp-clean-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var fs = require('fs');
var execFileSync = require('child_process').execFileSync;
var serve = require('gulp-serve');

var paths = {
  sass: ['./scss/**/*.scss']
};

gulp.task('default', ['sass']);

gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.scss')
    .pipe(sass({
      errLogToConsole: true
    }))
    .pipe(gulp.dest('./www/jspm_packages/github/driftyco/ionic-bower@1.3.1/css/'))
    .pipe(cleanCSS({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/jspm_packages/github/driftyco/ionic-bower@1.3.1/css/'))
    .on('end', done);
});

gulp.task('serve', serve('public'));
gulp.task('serve-build', serve(['public', 'build']));
gulp.task('serve-prod', serve({
  root: ['public', 'build'],
  port: 80,
  hostname: 'localhost',
  middleware: function(req, res) {
    // custom optional middleware
  }
}));


gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});

gulp.task('bundle', function(done) {
  readWriteAsync('./www/index.html',
                 [{ regex: /^\s+<!-- <script src="build.js"><\/script> -->/m, replacement: '\t<script src="build.js"></script>'}],
                 function() {
                   execFileSync('jspm', ['bundle', 'js/app', 'www/build.js', '--minify']);
                   done();
                 });
});

gulp.task('unbundle', function() {
  readWriteAsync('./www/index.html', [{ regex: /^\s+<script src="build.js"><\/script>/m, replacement: '\t<!-- <script src="build.js"></script> -->'}]);
  fs.access('www/build.js', fs.W_OK, function(err) {
    if (!err) execFileSync('rm', ['www/build.js', 'www/build.js.map']);
  });
});

gulp.task('prodMode', function() {
  readWriteAsync('./www/js/services/init.js', [{ regex: /firebaseConnect.*_app/, replacement: 'firebaseConnect.prod_app'}]);
});

gulp.task('devMode', function() {
  console.log("DEV MODE DOES NOT EXIST");
  return false;
  //readWriteAsync('./www/js/services/init.js', [{ regex: /firebaseConnect.*_app/, replacement: 'firebaseConnect.dev_app'}]);
});

gulp.task('stagingMode', function() {
  readWriteAsync('./www/js/services/init.js', [{ regex: /firebaseConnect.*_app/, replacement: 'firebaseConnect.stg_app'}]);
});


function readWriteAsync(file, replace, cb) {
  fs.readFile(file, 'utf-8', (err, data) => {
    if (err) throw err;

    replace.forEach((pair) => {
      data = data.replace(pair.regex, pair.replacement);
    });

    fs.writeFile(file, data, 'utf-8', (err) => {
      if (err) throw err;
      if (cb) cb();
    });
  });
}




