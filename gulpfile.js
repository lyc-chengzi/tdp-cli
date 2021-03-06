const gulp = require('gulp');
const gulpRm = require('gulp-rm');
const ts = require('gulp-typescript');

const tsProject = ts.createProject("tsconfig.json");

const paths = {
    bin: 'dist/bin/**/*.js',
    enum: 'dist/enum/**/*.js',
    lib: 'dist/lib/**/*.js',
};

function tsc() {
    return tsProject.src()
        .pipe(tsProject())
        .js.pipe(gulp.dest("dist"));
}

function clear() {
    return gulp
        .src(['dist/**/*', 'bin/**/*', 'lib/**/*'])
        .pipe(gulpRm());
}

function copyBin() {
    return gulp.src(paths.bin).pipe(gulp.dest('./bin'));
}
function copyLib() {
    return gulp.src(paths.lib).pipe(gulp.dest('./lib'));
}

function watch() {
    gulp.watch('src/**/*.ts', build);
}

const copy = gulp.series(copyBin, copyLib);

const build = gulp.series(clear, tsc, copy);
exports.default = build;
exports.build = build;
exports.watch = watch;
exports.clear = clear;