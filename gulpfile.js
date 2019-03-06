var rename = require('gulp-rename'),
    browserSync = require('browser-sync'),
    sass = require('gulp-sass'),
    clean = require('gulp-clean-css'),
    uglify = require('gulp-uglify'),
    autoprefixer = require('gulp-autoprefixer'),
    imagemin = require('gulp-imagemin'),
    //	del 		= 	require('del'),
    //	pngquant	=	require('imagemin-pngquant'),
    cleaner = require('gulp-clean'),
    concat = require('gulp-concat');

var { watch, series, parallel, dest, src, task } = require('gulp');

function imgMin() {
    return src('dev/img/*.*')
        .pipe(
            imagemin({
                progressive: true,
                interlaced: true
            })
        )
        .pipe(dest('dist/img'));
}

function cleanFolder() {
    return src('dist').pipe(cleaner());
}

function sas(cb) {
    return src('dev/sass/**/*.scss')
        .pipe(sass())
        .pipe(dest('dev/css'));
}

function css(cb) {
    return src('dev/css/**/*.css')
        .pipe(
            autoprefixer({
                browsers: ['last 2 versions'],
                cascade: false
            })
        )
        .pipe(concat('style.css'))
        .pipe(
            clean({
                level: 2
            })
        )
        .pipe(rename({ suffix: '.min' }))
        .pipe(dest('dist/css'))
        .pipe(browserSync.stream());
}

function scripts(cb) {
    return src('dev/js/*.js')
        .pipe(concat('scripts.js'))
        .pipe(
            uglify({
                toplevel: true
            })
        )
        .pipe(rename({ suffix: '.min' }))
        .pipe(dest('dist/scripts'))
        .pipe(browserSync.stream());
}

function html() {
    return src('dev/*.html')
        .pipe(dest('dist/'))
        .pipe(browserSync.stream());
}

function dev() {
    browserSync.init({
        server: {
            baseDir: 'dist/'
        }
    });
    watch('dev/sass/**/*.scss', { delay: 100 }, series(sas, css));
    watch('dev/*.html', { delay: 100 }, html);
    watch('dev/js/**/*.js', { delay: 100 }, scripts);
}

task('default', dev);
exports.build = series(cleanFolder, parallel(imgMin, html, sas, css, scripts));
