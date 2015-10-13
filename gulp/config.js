var root = './public/';
module.exports = {
	root: root,
	css: {
		src: root + 'lib/sass/',
		dest: root + 'css/'
	},
	js: {
		src:       root + 'lib/js/',
		dest:      root + 'js/',
		bundle:    'bundle.js',
		browserify: {
			debug:     true,
			transform: [ 'reactify', 'debowerify' ]
		}
	},
	jade: {
		src: root + 'lib/jade/',
		dest: root
	},
	build: {
		depends: [ 'js', 'css' ]
	}
};