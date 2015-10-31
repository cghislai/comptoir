import {join} from 'path';
import {PATH, APP_SRC} from '../config';
import {templateLocals, tsProjectFn} from '../utils';

export = function buildJSDev(gulp, plugins) {
  return function () {
    let tsProject = tsProjectFn(plugins);

    return gulp.src(APP_SRC+'/res/**')
      .pipe(gulp.dest(PATH.dest.dev.all + '/res'));
  };
};
