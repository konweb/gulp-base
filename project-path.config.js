/**
 * project-path.config.js
 */

// constants
var SRC     = './src';
var DEST    = './dest';
var ASSETS  = '/assets';

// export
module.exports = {
  assets : ASSETS,
  src : {
    dir        : SRC,
    htmlFiles  : SRC + '/**/*.jade',
    cssDir     : SRC + ASSETS + '/css',
    cssFiles   : SRC + ASSETS + '/css/**/*.scss',
    imageDir   : SRC + ASSETS + '/img',
    imageFiles : SRC + ASSETS + '/img/**/*',
    spriteDir  : SRC + ASSETS + '/img/sprite',
    spriteFiles: SRC + ASSETS + '/img/sprite/**/*',
    jsFiles    : SRC + ASSETS + '/js/**/*.js',
    fontDir    : SRC + ASSETS + '/fonts',
    fontFiles  : SRC + ASSETS + '/fonts/**/*'
  },
  dest: {
    dir       : DEST,
    htmlFiles : DEST + '/**/*.html',
    cssDir    : DEST + ASSETS + '/css',
    cssFiles  : DEST + ASSETS + '/css/**/*.css',
    imageDir  : DEST + ASSETS + '/img',
    imageFiles: DEST + ASSETS + '/img/**/*',
    spriteDir : DEST + ASSETS + '/img/sprite',
    jsDir     : DEST + ASSETS + '/js',
    fontDir   : DEST + ASSETS + '/fonts',
    fontFiles : DEST + ASSETS + '/fonts/**/*'
  }
};
