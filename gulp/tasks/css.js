var gulp   = require( 'gulp' );
var config = require( '../config.js' ).css;
var browserSync = require( 'browser-sync' );

gulp.task('sass', function() {
	var $ = require( 'gulp-load-plugins' )();
	return $.rubySass(config.src, {
		loadPath: process.cwd() + config.src,
		compass: true,
		style: 'expanded' // compact, compressed, or expanded
	})
	.pipe( $.plumber() )
	.on( 'error', function (err) { console.log(err.message); } )
	.pipe( gulp.dest( config.dest ) );
});

gulp.task('css', function(){
	var $ = require( 'gulp-load-plugins' )();
	return gulp.src( config.dest + '*.css' )
		.pipe( $.plumber() )
		.pipe($.pleeease({
			autoprefixer: {'browsers': ['last 4 versions', 'ios 6']},
			minifier: false,
			mqpacker: true
		}))
		.pipe( gulp.dest(config.dest) )
		.pipe( browserSync.reload( {stream: true} ) );
});
