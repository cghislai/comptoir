import {PATH, APP_SRC} from '../config';

export = function buildJSDev(gulp, plugins) {
  return function () {
    return gulp.src(APP_SRC+'/res/**')
      .pipe(gulp.dest(PATH.dest.dev.all + '/res'));
  };
};
