/* Dependencias */
var gulp = require('gulp'),
	autoprefixer = require('gulp-autoprefixer'),
	browserSync = require('browser-sync').create(),
	cleancss = require('gulp-clean-css'),
	concat = require('gulp-concat'),
	concatCss = require('gulp-concat-css'),
	imagemin = require('gulp-imagemin'),
	jpegoptim = require('imagemin-jpegoptim'),
	newer = require('gulp-newer'),
	plumber = require('gulp-plumber'),
	pngquant = require('imagemin-pngquant'),
	rename    = require('gulp-rename'),
	sass= require('gulp-sass'),
	uglify = require('gulp-uglify'),
	babel = require('gulp-babel'),
	watch = require('gulp-watch');
	
/* Configuración global */
var path={
	/* ************* FULL CSS ***************/										 
	inputCssGeneral:'./desarrollo/css/general/**/*.css',
	nameCssGeneral:'general.css',
	outputCssGeneral:'./produccion/css/general/',

	inputSass:'./desarrollo/sass/**/*.scss',
	nameSass:'main.css',
	ouputSass:'./produccion/css/',

	/* ************* FULL JS ***************/
	inputMyapp:'./desarrollo/js/*.js',
	nameMyapp:'myapp.js',
	outputMyapp:'./produccion/js/',

	inputJsGeneral:'./desarrollo/js/general/**/*.js',
	nameJsGeneral:'general.js',
	outputJsGeneral:'./produccion/js/general/',
	
	/* ****************  IMG ***************** */	
	inputImg:'desarrollo/img/**/*.{gif,png,jpg,svg,jpeg}',
	outputImg:'produccion/img/',
};


gulp.task('default',  gulp.series(function(done) {
    browserSync.init({
		server: "./",
		startPath: "/index.html",
		browser: 'chrome',
        host: 'localhost'
    });    
    gulp.watch(path.inputSass, gulp.parallel('sass')).on('change', browserSync.reload);
    done();
    gulp.watch(path.inputCssGeneral, gulp.parallel('cssall'));
    done();
    gulp.watch(path.inputJsGeneral, gulp.parallel('inputJsGeneral'));
    done();
    gulp.watch(path.inputMyapp, gulp.parallel('inputMyapp')).on('change', browserSync.reload);
    done();
    gulp.watch("./*.html").on('change', browserSync.reload);
}));
 
/*  Compilamos los archivos SASS*/
gulp.task('sass', gulp.series(function (done){
	gulp.src(path.inputSass)
		.pipe(plumber())
		.pipe(newer(path.ouputSass+path.nameSass))
		.pipe(sass())
		.pipe(cleancss())
		.pipe(rename(path.nameSass))
		.pipe(autoprefixer({
            browsers: ['last 3 versions'],
            cascade: false
        }))
		.pipe(gulp.dest(path.ouputSass))
		.pipe(browserSync.stream());
		done();
}));

gulp.task('cssall', gulp.series(function (done){
	gulp.src(path.inputCssGeneral)
		.pipe(plumber())
		.pipe(newer(path.outputCssGeneral+path.nameCssGeneral))
		.pipe(cleancss())
		.pipe(rename(path.nameCssGeneral))
		.pipe(gulp.dest(path.outputCssGeneral))
		.pipe(browserSync.stream());
		done();
}));

/* Comprimir frameworks */

gulp.task('inputJsGeneral', gulp.series(function(done){
	gulp.src(path.inputJsGeneral)
		.pipe(plumber())
		.pipe(newer(path.outputJsGeneral+path.nameJsGeneral))
		.pipe(concat(path.nameJsGeneral))
		.pipe(uglify())		
		.pipe(gulp.dest(path.outputJsGeneral))
		.pipe(browserSync.stream());
		done();
}));

gulp.task('inputMyapp', gulp.series(function(done){
	gulp.src(path.inputMyapp)
		.pipe(plumber())
		.pipe(newer(path.outputMyapp+path.nameMyapp))
		.pipe(concat(path.nameMyapp))
		.pipe(babel())
		.pipe(uglify())
		.pipe(gulp.dest(path.outputMyapp))
		.pipe(browserSync.stream());
		done();
}));



/* ****** Ejecutar para el pase a producción ********** */
