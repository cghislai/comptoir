import {join} from 'path';
import {APP_SRC, PATH, ENV} from '../config';

export = function buildSass(gulp, plugins, option) {
  return function () {
    return gulp.src(join(APP_SRC, '**', '*.scss'), {base: APP_SRC})
      .pipe(plugins.sass().on('error', plugins.sass.logError))
      .pipe(gulp.dest(PATH.dest[ENV].all));
  };
}
