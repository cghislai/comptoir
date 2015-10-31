import {PATH, ENV} from '../config';

let libs: string[] = [];

export = function buildLib(gulp) {
  return function () {
    let src = libs.concat(PATH.src[ENV].jslib_inject,
                          PATH.src[ENV].jslib_copy_only);

    return gulp.src(src)
      .pipe(gulp.dest(PATH.dest[ENV].lib));
  };
};
