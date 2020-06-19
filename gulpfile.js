// Main Gulp File
// MD. MEHADI HASAN SHIMUL

'use strict';
// Required Pacages
const 
gulp 				= require('gulp'),
watch 			= require('gulp-watch'),
modernizr 		= require('gulp-modernizr'),
webpack 			= require('webpack'),
sass 				= require('gulp-sass'),
postcss 			= require('gulp-postcss'),
autoprefixer 	= require('autoprefixer'),
imagemin 		= require('gulp-imagemin'),
del 				= require('del'),
usemin 			= require('gulp-usemin'),
rev 				= require('gulp-rev'),
cssnano 			= require('gulp-cssnano'),
uglify 			= require('gulp-uglify'),
browserSync 	= require('browser-sync').create();

sass.compiler 	= require('node-sass');


// Modernizr Task
gulp.task('modernizr',function() {
  	var settings = { 
    	"options" : [
      	"setClasses",
      	"addTest",
      	"html5printshiv",
      	"testProp",
      	"fnBind"
    	]
  	};
  	return gulp.src(['./app/assets/styles/**/*.css', './app/assets/scripts/**/*.js'])
    	.pipe(modernizr(settings))
    	.pipe(gulp.dest('./app/temp/scripts/'))
});

// Scripts Task
gulp.task('scripts', gulp.series('modernizr', function(callback) {
  	webpack(require('./webpack.config.js'), function(err, stats) {
    	if (err) {
      	console.log(err.toString());
    	}
    	console.log(stats.toString());
    	callback();
  	});
}));


// Styles Task
gulp.task('styles', function() {
  	return gulp.src('./app/assets/styles/styles.scss')
    	.pipe(sass.sync().on('error', sass.logError))
    	.pipe(postcss([autoprefixer]))
      .on('error', function(errorInfo) {
        	console.log(errorInfo.toString());
        	this.emit('end');
       })
    	.pipe(gulp.dest('./app/temp/styles'));
});

 
// Watch Tasks
gulp.task('watch', function() {

  	browserSync.init({
    	notify: false,
    	server: {
      	baseDir: "app"
    	}
  	});

  	watch('./app/**/**/*', function() {
    	browserSync.reload();
  	});

  	watch('./app/assets/styles/**/*.scss', gulp.series('styles',function() {
	 	return gulp.src('./app/temp/styles/styles.css')
    		.pipe(browserSync.stream());
  	}));

  	watch('./app/assets/scripts/**/*.js', gulp.series('scripts',function() {
	 	browserSync.reload();
  	}));

});

// Build Tasks
gulp.task('previewDist', function() {
  	browserSync.init({
    	notify: false,
    	server: {
      	baseDir: "docs"
    	}
  	});
});

gulp.task('deleteDistFolder', function() {
  	return del("./docs");
});


gulp.task('copyGeneralFiles', function() {
  	var pathsToCopy = [
    		'./app/**/*',
    		'!./app/index.html',
    		'!./app/assets/images/**',
    		'!./app/assets/styles/**',
    		'!./app/assets/scripts/**',
    		'!./app/temp',
    		'!./app/temp/**'
  		]
  	return gulp.src(pathsToCopy)
    	.pipe(gulp.dest("./docs"));
});

gulp.task('optimizeImages', function() {
  	return gulp.src(['./app/assets/images/*', '!./app/assets/images/icons', '!./app/assets/images/icons/**/*'])
    	.pipe(imagemin({
      	progressive: true,
      	interlaced: true,
      	multipass: true
    	}))
    	.pipe(gulp.dest("./docs/assets/images"));
});

gulp.task('usemin', gulp.series('styles', 'scripts', function() {
  	return gulp.src("./app/index.html")
    	.pipe(usemin({
      	css: [function() {return rev()}, function() {return cssnano()}],
      	js: [function() {return rev()}, function() {return uglify()}]
    	}))
    	.pipe(gulp.dest("./docs"));
}));

gulp.task('build', gulp.series('deleteDistFolder', 'copyGeneralFiles', 'usemin', 'optimizeImages'));

