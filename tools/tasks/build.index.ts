import {join} from 'path';
import {PATH, ENV} from '../config';
import {
  injectableAssetsRef,
  transformPath,
  templateLocals
} from '../utils';

export = function buildIndexDev(gulp, plugins) {
  return function () {
    let injectables = injectableAssetsRef();
    let target = gulp.src(injectables, { read: false });

    return gulp.src(join(PATH.src.all, 'index.html'))
      .pipe(plugins.inject(target, {
        transform: transformPath(plugins, ENV)
      }))
      .pipe(plugins.template(templateLocals()))
      .pipe(gulp.dest(PATH.dest[ENV].all));
  };
};
