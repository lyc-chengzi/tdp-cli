import gulp from 'gulp';
import ts from 'gulp-typescript';

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

const build = gulp.series(tsc, copy);
export default build;
export {build, copy, tsc, watch};