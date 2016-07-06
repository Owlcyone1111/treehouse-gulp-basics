'use strict';

var gulp = require('gulp'),
	concat = require('gulp-concat'), // To concat all the needed scripts
	uglify = require('gulp-uglify'), // To minify
	rename = require('gulp-rename'), // For rename function to work when minifying
	sass = require('gulp-sass'), // To compile SASS into CSS
	maps = require('gulp-sourcemaps');

gulp.task("hello", function() {
	console.log("Hello!"); // gulp hello to run this task
});

// gulp concatScripts
gulp.task("concatScripts", function() {
	// Takes string or array as first parameter
	return gulp.src(['js/jquery.js', 'js/sticky/jquery.sticky.js', 'js/main.js'])
	.pipe(maps.init())
	.pipe(concat("app.js")) // Pipe into app.js
	.pipe(maps.write('./'))
	.pipe(gulp.dest("js")); // Pipe into js directory
});

gulp.task("minifyScripts", ["concatScripts"], function() {
	return gulp.src("js/app.js")
	.pipe(uglify())
	.pipe(rename('app.min.js'))
	.pipe(gulp.dest('js'))
});

gulp.task('compileSass', function() {
	return gulp.src("scss/application.scss")
	.pipe(maps.init())
	.pipe(sass())
	.pipe(maps.write('./')) // Current working directory relative to gulp.dest directory
	.pipe(gulp.dest('css'));
});

gulp.task('watchSass', function() {
	gulp.watch('scss/**/*.scss', ['compileSass']); // Globbing pattern, look in scss folder, all subdirectories, and all files with .scss extension
});

// Gulp runs tasks concurrently at the same time, but we need concat before minify, so add dependency between concat and minify and return statements to run tasks serially
gulp.task("build", ['concatScripts', 'minifyScripts', 'compileSass']);

 // Dependencies go in bracket, which will be ran first before default
gulp.task("default", ['build'], ["hello"], function() {
	console.log("This is the default task!");
});