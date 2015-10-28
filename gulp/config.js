/**
 * config.js
 * - ディレクトリ構造
 */

const ROOT       =     './';
const SRC_ROOT   = ROOT + 'source';
const BUILD_ROOT = ROOT + 'build';

module.exports = {
	root       : ROOT,
	src_root   : SRC_ROOT,
	build_root : BUILD_ROOT,
	css : {
		src  : SRC_ROOT + '/sass/',
		dest : BUILD_ROOT + '/css/'
	},
	js: {
		src        : SRC_ROOT + '/js/',
		dest       : BUILD_ROOT + '/js/',
		bundle     : 'bundle.js',
		browserify : {
			debug     : true,
			transform : [ 'reactify', 'debowerify' ]
		}
	},
	jade: {
		src  : SRC_ROOT + '/jade/',
		dest : BUILD_ROOT + '/'
	},
	build: {
		depends: [ 'js', 'css' ]
	}
};