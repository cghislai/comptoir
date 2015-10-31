import {join} from 'path';
import {PATH, ENV} from '../config';

export =
function buildCSSDev(gulp, plugins, option) {
    return function () {
        var srcPath = PATH.src[ENV];
        var destPath = PATH.dest[ENV];
        return gulp.src(srcPath.csslib)
            .pipe(gulp.dest(join(destPath.css)));
    };
}
