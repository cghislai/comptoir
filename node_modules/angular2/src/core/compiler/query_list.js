'use strict';var collection_1 = require('angular2/src/facade/collection');
/**
 * Injectable Objects that contains a live list of child directives in the light Dom of a directive.
 * The directives are kept in depth-first pre-order traversal of the DOM.
 *
 * In the future this class will implement an Observable interface.
 * For now it uses a plain list of observable callbacks.
 */
var QueryList = (function () {
    function QueryList() {
        this._results = [];
        this._callbacks = [];
        this._dirty = false;
    }
    QueryList.prototype.reset = function (newList) {
        this._results = newList;
        this._dirty = true;
    };
    QueryList.prototype.add = function (obj) {
        this._results.push(obj);
        this._dirty = true;
    };
    QueryList.prototype.fireCallbacks = function () {
        if (this._dirty) {
            collection_1.ListWrapper.forEach(this._callbacks, function (c) { return c(); });
            this._dirty = false;
        }
    };
    QueryList.prototype.onChange = function (callback) { this._callbacks.push(callback); };
    QueryList.prototype.removeCallback = function (callback) { collection_1.ListWrapper.remove(this._callbacks, callback); };
    Object.defineProperty(QueryList.prototype, "length", {
        get: function () { return this._results.length; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QueryList.prototype, "first", {
        get: function () { return collection_1.ListWrapper.first(this._results); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QueryList.prototype, "last", {
        get: function () { return collection_1.ListWrapper.last(this._results); },
        enumerable: true,
        configurable: true
    });
    QueryList.prototype.map = function (fn) { return this._results.map(fn); };
    QueryList.prototype[Symbol.iterator] = function () { return this._results[Symbol.iterator](); };
    return QueryList;
})();
exports.QueryList = QueryList;
//# sourceMappingURL=query_list.js.map