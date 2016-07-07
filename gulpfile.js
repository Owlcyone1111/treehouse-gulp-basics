"use strict";

var gulp = require('gulp'),
	concat = require('gulp-concat'), // To concat all the needed scripts
	uglify = require('gulp-uglify'), // To minify
	rename = require('gulp-rename'), // For rename function to work when minifying
	sass = require('gulp-sass'), // To compile SASS into CSS
	maps = require('gulp-sourcemaps'),
	del = require('del');

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

// ['concatScripts'] is a dependency to run tasks serially
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

gulp.task('watchFiles', function() {
	gulp.watch('scss/**/*.scss', ['compileSass']); // Globbing pattern, look in scss folder, all subdirectories, and all files with .scss extension
	gulp.watch('js/main.js', ['concatScripts']); // Watch main.js for changes and run concatScripts task when changed
});

// Gulp runs tasks concurrently at the same time, but we need concat before minify, so add dependency between concat and minify and return statements for tasks that depend on them, to run tasks serially. 'base' keeps the directory structure, otherwise it will dump all production files into 'dist' folder
gulp.task("build", ['concatScripts', 'minifyScripts', 'compileSass'], function() {
	return gulp.src(["css/application.css",
		"js/app.min.js",
		"index.html",
		"img/**",
		"fonts/**"], { base: './' })
	.pipe(gulp.dest('dist'));
});

// Clean task to make sure nothing stays from past builds, especially for renamed files since new ones won't overwrite them
gulp.task('clean', function() {
	del(['dist', 'css/application.css*', 'app*.js*']);
});

gulp.task('serve', ['watchFiles']); // Initiates watchFiles task whenever we use the gulp serve command, can see changes made to Sass files right away

 // Default task. Dependencies go in bracket, which will be ran first before default
gulp.task("default", ['clean', 'hello'], function() {
	gulp.start('build'); // Added clean as dependency, so build will run after clean has finished
});
