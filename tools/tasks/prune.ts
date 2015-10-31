import * as async from 'async';
import * as del from 'del';
import {join} from 'path';
import {APP_DEST} from '../config';

export = function clean(gulp, plugins, option) {
  return pruneAll;
};

function pruneAll(done) {
  async.parallel([
    pruneDist,
    pruneModules
  ], done);
}
function pruneDist(done) {
  del(APP_DEST, done);
}
function pruneModules(done) {
  del('node_modules', done);
}
