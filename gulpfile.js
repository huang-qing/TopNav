var gulp = require("gulp");
var ts = require("gulp-typescript");
var tsProject = ts.createProject("tsconfig.json");
//var data = require('gulp-data');
var stylus = require('gulp-stylus');
// include, if you want to work with sourcemaps
//var sourcemaps = require('gulp-sourcemaps');

//使用gulp-typescript进行编译
gulp.task("ts", function () {
    return tsProject.src()
        .pipe(tsProject())
        .js
        .pipe(gulp.dest("dist"));
});

gulp.task('styl', function () {
    return gulp.src('./src/top-nav.styl')
        //.pipe(sourcemaps.init())
        .pipe(stylus())
        //.pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./dist'));
});


gulp.task('watch-ts', function () {
    gulp.watch("src/top-nav.ts", gulp.series("ts"));
});

gulp.task('watch-styl', function () {
    gulp.watch("src/top-nav.styl", gulp.series("styl"));
});

gulp.task("default", gulp.parallel(["watch-ts", "watch-styl"]));

gulp.task("dist", gulp.parallel(["ts", "styl"]));