var gulp        = require('gulp'),
		$           = require('gulp-load-plugins')(),
		browserSync = require('browser-sync'),
		root        = './public/',
		dir         = {
			lib: {
				sass: root + 'lib/sass/',
				js: root + 'lib/js/',
				template: root + 'lib/jade/',
				components: root + 'lib/components/'
			},
			dist: {
				css: root + 'css/',
				js: root + 'js/',
				template: root
			}
		};


// file watch
gulp.task('watch', function(){
	var gaze_opt = {
		debounceDelay: 1000 // wait after the last run
	};
	gulp.watch([dir.lib.template + '/**/*.jade'], gaze_opt, ['jade']);
	gulp.watch([root + "**/*.html"], gaze_opt, ['bs-reload']);
	gulp.watch([dir.lib.sass + '/**/*.+(scss|sass)'], gaze_opt, ['sass']);
	gulp.watch([dir.dist.css + '/*.css'], gaze_opt, ['css']);
	gulp.watch([dir.lib.js + '/**/*.js'], gaze_opt, ['scripts']);
});


// sass compile
gulp.task('sass', function() {
	return $.rubySass(dir.lib.sass, {
		loadPath: process.cwd() + dir.lib.sass,
		compass: true,
		style: 'expanded' // compact, compressed, or expanded
	})
	.pipe($.plumber())
	.on('error', function (err) { console.log(err.message); })
	.pipe(gulp.dest(dir.dist.css));
});


// css adjust
gulp.task('css', function(){
	return gulp.src(dir.dist.css + '*.css')
		.pipe($.plumber())
		.pipe($.pleeease({
			autoprefixer: {'browsers': ['last 4 versions', 'ios 6']},
			minifier: false,
			mqpacker: true
		}))
		.pipe(gulp.dest(dir.dist.css))
		.pipe(browserSync.reload({stream: true}));
});


// jade compile
gulp.task('jade', function(){
	return gulp.src(['!' + dir.lib.template + 'inc/*.jade', dir.lib.template + '*.jade'])
		.pipe($.plumber())
		.pipe($.jade({
			pretty: true
		}))
		.pipe(gulp.dest(dir.dist.template));
});


// javascript concat & uglify
gulp.task('scripts', function() {
	gulp.src([
			dir.lib.components + 'jquery/dist/jquery.min.js',
			dir.lib.components + 'underscore/underscore-min.js',
			dir.lib.components + 'backbone/backbone.js',
			root + 'lib/js/**/*.js'
		])
		.pipe($.plumber())
		.pipe($.concat('all.js'))
		.pipe($.uglify())
		.pipe(gulp.dest(dir.dist.js))
		.pipe(browserSync.reload({stream: true}));
});


// Browser Sync
gulp.task('bs', function() {
	browserSync({
		open: false,
		server: {
			baseDir: root,
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


// Browser Sync reload
gulp.task('bs-reload', function () {
	browserSync.reload();
});


// defaults task
gulp.task("start", ['watch', 'bs']);


// gulpfile save restart
var spawn = require('child_process').spawn;
gulp.task('default', function() {
	var process;
	function restart() {
		if (process) process.kill();
		process = spawn('gulp', ['start'], {stdio: 'inherit'});
	}
	gulp.watch('gulpfile.js', restart);
	restart();
});