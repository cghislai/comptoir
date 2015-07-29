'use strict';/// <reference path="../../typings/rx/rx.d.ts" />
var lang_1 = require('angular2/src/facade/lang');
/**
 * Abstract class from which real backends are derived.
 *
 * The primary purpose of a `ConnectionBackend` is to create new connections to fulfill a given
 * {@link Request}.
 */
var ConnectionBackend = (function () {
    function ConnectionBackend() {
    }
    ConnectionBackend.prototype.createConnection = function (request) { throw new lang_1.BaseException('Abstract!'); };
    return ConnectionBackend;
})();
exports.ConnectionBackend = ConnectionBackend;
/**
 * Abstract class from which real connections are derived.
 */
var Connection = (function () {
    function Connection() {
    }
    Connection.prototype.dispose = function () { throw new lang_1.BaseException('Abstract!'); };
    return Connection;
})();
exports.Connection = Connection;
//# sourceMappingURL=interfaces.js.map