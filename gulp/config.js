var root = './';
module.exports = {
	root: root,
	css: {
		src: root + 'source/sass/',
		dest: root + 'build/css/'
	},
	js: {
		src:       root + 'source/js/',
		dest:      root + 'build/js/',
		bundle:    'bundle.js',
		browserify: {
			debug:     true,
			transform: [ 'reactify', 'debowerify' ]
		}
	},
	jade: {
		src: root + 'source/jade/',
		dest: root + 'build/'
	},
	build: {
		depends: [ 'js', 'css' ]
	}
};