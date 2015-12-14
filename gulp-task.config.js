/**
 * gulp-tasks.config.js
 */

var paths = require('./project-path.config');

// jade
exports.jade = {
  pretty: true
};

// autoprefixer
exports.autoprefixer = {
  browsers: ['last 2 versions']
};

// spritesmith
exports.spritesmith = {
  imgName: 'sprite.png',
  imgPath: paths.assets + '/img/sprite.png',
  cssName: '_sprite.scss',
  padding: 0,
  retinaSrcFilter: paths.src.spriteDir + '/*-2x.png',
  retinaImgName: 'sprite-2x.png',
  retinaImgPath: paths.assets + '/img/sprite-2x.png'
};

// iconfont
exports.iconfont = {
  fontName: 'glyphicon-font',
  appendUnicode: true,
  formats: ['ttf', 'eot', 'woff', 'svg'],
  startCodepoint: 0xF001
};