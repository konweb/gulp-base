var gulp        = require( 'gulp' );
var config      = require( '../config.js' );
var browserSync = require( 'browser-sync' );

gulp.task('bs', function() {
	browserSync({
		open: false,
		server: {
			baseDir: config.root
		},
		watchOptions: {
			debounceDelay: 1000
		},
		ui: {
			port: 3001
		},
		port: 3000,
		logLevel: 'debug', // info,silent
		browser: 'google chrome' // ["google chrome", "firefox"]
	});
});

gulp.task('bs-reload', function () {
	browserSync.reload();
});
