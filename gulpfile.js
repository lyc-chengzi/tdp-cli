import gulp from 'gulp';

const paths = {
    bin: 'dist/bin/**/*.js',
    enum: 'dist/enum/**/*.js',
    lib: 'dist/lib/**/*.js',
};

function copyBin() {
    return gulp.src(paths.bin).pipe(gulp.dest('./bin'));
}
function copyLib() {
    return gulp.src(paths.lib).pipe(gulp.dest('./lib'));
}

const copy = gulp.series(copyBin, copyLib);

export {copy};