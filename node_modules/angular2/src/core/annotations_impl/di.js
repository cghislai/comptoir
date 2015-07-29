'use strict';var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
    switch (arguments.length) {
        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
    }
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var lang_1 = require('angular2/src/facade/lang');
var metadata_1 = require('angular2/src/di/metadata');
var di_1 = require('angular2/di');
/**
 * Specifies that a constant attribute value should be injected.
 *
 * The directive can inject constant string literals of host element attributes.
 *
 * ## Example
 *
 * Suppose we have an `<input>` element and want to know its `type`.
 *
 * ```html
 * <input type="text">
 * ```
 *
 * A decorator can inject string literal `text` like so:
 *
 * ```javascript
 * @Directive({
 *   selector: `input'
 * })
 * class InputDirective {
 *   constructor(@Attribute('type') type) {
 *     // type would be `text` in this example
 *   }
 * }
 * ```
 */
var Attribute = (function (_super) {
    __extends(Attribute, _super);
    function Attribute(attributeName) {
        _super.call(this);
        this.attributeName = attributeName;
    }
    Object.defineProperty(Attribute.prototype, "token", {
        get: function () {
            // Normally one would default a token to a type of an injected value but here
            // the type of a variable is "string" and we can't use primitive type as a return value
            // so we use instance of Attribute instead. This doesn't matter much in practice as arguments
            // with @Attribute annotation are injected by ElementInjector that doesn't take tokens into
            // account.
            return this;
        },
        enumerable: true,
        configurable: true
    });
    Attribute.prototype.toString = function () { return "@Attribute(" + lang_1.stringify(this.attributeName) + ")"; };
    Attribute = __decorate([
        lang_1.CONST(), 
        __metadata('design:paramtypes', [String])
    ], Attribute);
    return Attribute;
})(metadata_1.DependencyMetadata);
exports.Attribute = Attribute;
/**
 * Specifies that a {@link QueryList} should be injected.
 *
 * See {@link QueryList} for usage and example.
 */
var Query = (function (_super) {
    __extends(Query, _super);
    function Query(_selector, _a) {
        var _b = (_a === void 0 ? {} : _a).descendants, descendants = _b === void 0 ? false : _b;
        _super.call(this);
        this._selector = _selector;
        this.descendants = descendants;
    }
    Object.defineProperty(Query.prototype, "isViewQuery", {
        get: function () { return false; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Query.prototype, "selector", {
        get: function () { return di_1.resolveForwardRef(this._selector); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Query.prototype, "isVarBindingQuery", {
        get: function () { return lang_1.isString(this.selector); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Query.prototype, "varBindings", {
        get: function () { return lang_1.StringWrapper.split(this.selector, new RegExp(",")); },
        enumerable: true,
        configurable: true
    });
    Query.prototype.toString = function () { return "@Query(" + lang_1.stringify(this.selector) + ")"; };
    Query = __decorate([
        lang_1.CONST(), 
        __metadata('design:paramtypes', [Object, Object])
    ], Query);
    return Query;
})(metadata_1.DependencyMetadata);
exports.Query = Query;
/**
 * Specifies that a {@link QueryList} should be injected.
 *
 * See {@link QueryList} for usage and example.
 */
var ViewQuery = (function (_super) {
    __extends(ViewQuery, _super);
    function ViewQuery(_selector, _a) {
        var _b = (_a === void 0 ? {} : _a).descendants, descendants = _b === void 0 ? false : _b;
        _super.call(this, _selector, { descendants: descendants });
    }
    Object.defineProperty(ViewQuery.prototype, "isViewQuery", {
        get: function () { return true; },
        enumerable: true,
        configurable: true
    });
    ViewQuery.prototype.toString = function () { return "@ViewQuery(" + lang_1.stringify(this.selector) + ")"; };
    ViewQuery = __decorate([
        lang_1.CONST(), 
        __metadata('design:paramtypes', [Object, Object])
    ], ViewQuery);
    return ViewQuery;
})(Query);
exports.ViewQuery = ViewQuery;
//# sourceMappingURL=di.js.map