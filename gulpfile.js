/**
 * gulpfile.js
 */

// load modules
var fs           = require('fs');
var gulp         = require('gulp');
var loader       = require('gulp-load-plugins');
var $            = loader();
var runSequence  = require('run-sequence');
var merge        = require('event-stream').merge;
var browserSync  = require('browser-sync');
var rimraf       = require('rimraf');

// load configurations
var paths = require('./project-path.config');
var tasks = require('./gulp-task.config');


/**
 * html:pre
 * - compile jade
 */
gulp.task('html:pre', function () {
  return gulp.src(paths.src.htmlFiles)
    .pipe($.plumber())
    .pipe($.filter(function (file) {
      return !/\/_/.test(file.path);
    }))
    .pipe($.jade(tasks.jade))
    .pipe(gulp.dest(paths.dest.dir));
});

/**
 * css:pre
 * - compile scss
 */
gulp.task('css:pre', function () {
  return gulp.src(paths.src.cssFiles)
    .pipe($.plumber())
    .pipe($.filter(function (file) {
      var path = file.path;
      return !/\/_/.test(path) && !/\.ejs/.test(path);
    }))
    .pipe($.sass({
      errLogToConsole: true,
      outputStyle: 'compressed'
    }).on('error', $.sass.logError))
    .pipe($.autoprefixer(tasks.autoprefixer))
    .pipe(gulp.dest(paths.dest.cssDir));
});

/**
 * font
 * - generete icon-font from svg
 */
gulp.task('font', function (cb) {
  var fontName = tasks.iconfont.fontName;

  return gulp.src(paths.src.fontFiles)
    .pipe($.plumber())
    .pipe($.iconfont(tasks.iconfont))
    .on('glyphs', function (glyphs) {
      var option = {
        glyphs   : glyphs,
        fontName : fontName,
        fontPath : paths.assets + '/fonts/',
        className: 'glyphicon'
      };

      gulp.src(paths.src.fontDir + '/_template/_icons.scss')
        .pipe($.consolidate('lodash', option))
        .pipe($.rename({
          basename: '_' + fontName
        }))
        .pipe(gulp.dest(paths.src.cssDir));

      gulp.src(paths.src.fontDir + '/_template/_icons.html')
        .pipe($.consolidate('lodash', option))
        .pipe($.rename({
          basename: '_' + fontName + '_sample'
        }))
        .pipe(gulp.dest(paths.dest.dir));
    })
    .pipe($.filter(function (file) {
      return !/\/_/.test(file.path);
    }))
    .pipe(gulp.dest(paths.dest.fontDir)).on('end', function() {
      rimraf(paths.dest.fontDir + '/icons', cb);
    });
});

/**
 * sprite
 * - generate sprite-image
 */
gulp.task('image:sprite', function () {
  var sprite = gulp.src(paths.src.spriteFiles)
    .pipe($.plumber())
    .pipe($.spritesmith(tasks.spritesmith))

  return merge(
    sprite.img.pipe(gulp.dest(paths.src.imageDir)),
    sprite.css.pipe(gulp.dest(paths.src.cssDir))
  )
});

/**
 * image:min
 * - 画像に関するタスク
 * - 画像を圧縮する
 */
gulp.task('image:min', function (cb) {
  gulp.src(
      [paths.src.imageFiles, "!" + paths.src.spriteDir + "/*"]
    )
    .pipe($.plumber())
    .pipe($.imagemin())
    .pipe(gulp.dest(paths.dest.imageDir)).on('end', function() {
      rimraf(paths.dest.spriteDir, cb);
    });
});

/**
 * image:clean
 * - 画像フォルダを一度空にするタスク
 */
gulp.task('image:clean', function (cb) {
  rimraf(paths.dest.imageFiles, cb);
});

/**
 * js
 * - JSに関するタスク
 * - 現状はsrc → destにコピーするのみ
 */
gulp.task('js:copy', function () {
  gulp.src(paths.src.jsFiles)
    .pipe($.plumber())
    .pipe($.filter(function (file) {
      var path = file.path;
      return !/\/_/.test(path) && !/\.ejs/.test(path);
    }))
    .pipe(gulp.dest(paths.dest.jsDir))
});

/**
 * js
 * - JSに関するタスク
 * - 現状はsrc → destにコピーするのみ
 */
gulp.task('js:doc', function () {
  gulp.src(paths.src.jsFiles).pipe($.jsdoc('./jsdoc'));
});

/**
 * jslint
 */
gulp.task('js:lint', function () {
  return gulp.src(paths.dest.jsDir + "/app/**/*.js")
    .pipe($.plumber())
    .pipe($.jslint({
        node: true,
        // evil: true,
        // nomen: true,
        devel: true,
        unparam: true,
        sloppy: true,
        vars: false,
        nomen: true,
        plusplus: true,
        maxerr: 1000,
        indent: 4,
        global: [],
        predef: [],
        reporter: 'default',
        errorsOnly: false
    }))
    .on('error', function (error) {
        console.error(String(error));
    });
});

/**
 * r:build
 * - requirejsのモジュールを結合するタスク
 * - shellでr.jsを実行する
 */
// var rPath_js     = paths.dest.jsDir + '/app/page';
// var rPath_config = paths.dest.jsDir + '/library/require/require_config.js';
// gulp.task('r:build', $.shell.task([
//   'r.js -o baseUrl='+rPath_js+'/top/ name=main out='+rPath_js+'/top/main.min.js mainConfigFile='+rPath_config+'',
//   'r.js -o baseUrl='+rPath_js+'/condition/ name=main out='+rPath_js+'/condition/main.min.js mainConfigFile='+rPath_config+''
// ]));

/**
 * _postinstall
 * npm scriptsのpostinstallのフック
 * - bootstrap-sassをstylesにコピーする
 */
gulp.task('_postinstall', () => {
  gulp.src('node_modules/bootstrap-sass/assets/stylesheets/**/*.scss')
    .pipe(gulp.dest(paths.src.cssDir + '/_bootstrap/'));
});

/**
 * diffzip
 * リモートとローカルの差分ファイルをzipにする
 */
gulp.task('diffzip', function() {
  var yymmdd = (function() {
    var date = new Date();
    var yy   = date.getFullYear().toString().slice(-2);
    var m    = (date.getMonth() + 1).toString();
    var d    = date.getDate().toString();

    return `${yy}${m.length > 1 ? m : 0 + m }${d.length > 1 ? d : 0 + d}`;
  })();

  exec(`git archive --format=zip --prefix=${yymmdd}/ HEAD \`git diff --name-only HEAD HEAD^\` -o archive-${yymmdd}.zip`, (err, stdout, stderr) => {
    if (err) {
      console.log(err);
    }
    if (stdout) {
      console.log(stdout);
    }
    if (stderr) {
      console.log(stderr);
    }
  });
});


/**
 * build:pre
 * - pre build
 */
gulp.task('js', function () {
  return runSequence(
    'js:copy'
  );
});

/**
 * build:pre
 * - pre build
 */
gulp.task('build', function () {
  return runSequence(
    'html:pre',
    'css:pre',
    'image',
    'js',
    'font'
  );
});

/**
 * image
 * - image
 */
gulp.task('image', function () {
  return runSequence(
    'image:sprite',
    'image:clean',
    'image:min'
  );
});

/**
 * watch
 * - do pre process watch files
 */
gulp.task('watch', ['build'], function () {
  gulp.watch(paths.src.cssFiles, ['css:pre']);
  gulp.watch(paths.src.htmlFiles, ['html:pre']);
  gulp.watch(paths.src.jsFiles, ['js:copy']);
  gulp.watch(paths.src.fontFiles, ['font']);
  gulp.watch('gulpfile.js', restart);
  fs.watchFile(paths.src.spriteDir, function () {
    return runSequence('image');
  });
});

// gulpfile save restart
var spawn = require('child_process').spawn;
var process;
function restart() {
  if (process) process.kill();
  process = spawn('gulp', ['watch'], {stdio: 'inherit'});
}