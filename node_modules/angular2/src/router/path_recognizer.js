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
var collection_1 = require('angular2/src/facade/collection');
var lang_2 = require('angular2/src/facade/lang');
var helpers_1 = require('angular2/src/router/helpers');
var url_1 = require('./url');
// TODO(jeffbcross): implement as interface when ts2dart adds support:
// https://github.com/angular/ts2dart/issues/173
var Segment = (function () {
    function Segment() {
    }
    Segment.prototype.generate = function (params) { return ''; };
    return Segment;
})();
exports.Segment = Segment;
var TouchMap = (function () {
    function TouchMap(map) {
        var _this = this;
        this.map = collection_1.StringMapWrapper.create();
        this.keys = collection_1.StringMapWrapper.create();
        if (lang_1.isPresent(map)) {
            collection_1.StringMapWrapper.forEach(map, function (value, key) {
                _this.map[key] = lang_1.isPresent(value) ? value.toString() : null;
                _this.keys[key] = true;
            });
        }
    }
    TouchMap.prototype.get = function (key) {
        collection_1.StringMapWrapper.delete(this.keys, key);
        return this.map[key];
    };
    TouchMap.prototype.getUnused = function () {
        var _this = this;
        var unused = collection_1.StringMapWrapper.create();
        var keys = collection_1.StringMapWrapper.keys(this.keys);
        collection_1.ListWrapper.forEach(keys, function (key) { unused[key] = collection_1.StringMapWrapper.get(_this.map, key); });
        return unused;
    };
    return TouchMap;
})();
function normalizeString(obj) {
    if (lang_1.isBlank(obj)) {
        return null;
    }
    else {
        return obj.toString();
    }
}
var ContinuationSegment = (function (_super) {
    __extends(ContinuationSegment, _super);
    function ContinuationSegment() {
        _super.apply(this, arguments);
    }
    return ContinuationSegment;
})(Segment);
var StaticSegment = (function (_super) {
    __extends(StaticSegment, _super);
    function StaticSegment(string) {
        _super.call(this);
        this.string = string;
        this.name = '';
        this.regex = url_1.escapeRegex(string);
        // we add this property so that the route matcher still sees
        // this segment as a valid path even if do not use the matrix
        // parameters
        this.regex += '(;[^\/]+)?';
    }
    StaticSegment.prototype.generate = function (params) { return this.string; };
    return StaticSegment;
})(Segment);
var DynamicSegment = (function () {
    function DynamicSegment(name) {
        this.name = name;
        this.regex = "([^/]+)";
    }
    DynamicSegment.prototype.generate = function (params) {
        if (!collection_1.StringMapWrapper.contains(params.map, this.name)) {
            throw new lang_1.BaseException("Route generator for '" + this.name + "' was not included in parameters passed.");
        }
        return normalizeString(params.get(this.name));
    };
    DynamicSegment = __decorate([
        lang_2.IMPLEMENTS(Segment), 
        __metadata('design:paramtypes', [String])
    ], DynamicSegment);
    return DynamicSegment;
})();
var StarSegment = (function () {
    function StarSegment(name) {
        this.name = name;
        this.regex = "(.+)";
    }
    StarSegment.prototype.generate = function (params) { return normalizeString(params.get(this.name)); };
    return StarSegment;
})();
var paramMatcher = /^:([^\/]+)$/g;
var wildcardMatcher = /^\*([^\/]+)$/g;
function parsePathString(route) {
    // normalize route as not starting with a "/". Recognition will
    // also normalize.
    if (lang_1.StringWrapper.startsWith(route, "/")) {
        route = lang_1.StringWrapper.substring(route, 1);
    }
    var segments = splitBySlash(route);
    var results = [];
    var specificity = 0;
    // The "specificity" of a path is used to determine which route is used when multiple routes match
    // a URL.
    // Static segments (like "/foo") are the most specific, followed by dynamic segments (like
    // "/:id"). Star segments
    // add no specificity. Segments at the start of the path are more specific than proceeding ones.
    // The code below uses place values to combine the different types of segments into a single
    // integer that we can
    // sort later. Each static segment is worth hundreds of points of specificity (10000, 9900, ...,
    // 200), and each
    // dynamic segment is worth single points of specificity (100, 99, ... 2).
    if (segments.length > 98) {
        throw new lang_1.BaseException("'" + route + "' has more than the maximum supported number of segments.");
    }
    var limit = segments.length - 1;
    for (var i = 0; i <= limit; i++) {
        var segment = segments[i], match;
        if (lang_1.isPresent(match = lang_1.RegExpWrapper.firstMatch(paramMatcher, segment))) {
            results.push(new DynamicSegment(match[1]));
            specificity += (100 - i);
        }
        else if (lang_1.isPresent(match = lang_1.RegExpWrapper.firstMatch(wildcardMatcher, segment))) {
            results.push(new StarSegment(match[1]));
        }
        else if (segment == '...') {
            if (i < limit) {
                // TODO (matsko): setup a proper error here `
                throw new lang_1.BaseException("Unexpected \"...\" before the end of the path for \"" + route + "\".");
            }
            results.push(new ContinuationSegment());
        }
        else if (segment.length > 0) {
            results.push(new StaticSegment(segment));
            specificity += 100 * (100 - i);
        }
    }
    var result = collection_1.StringMapWrapper.create();
    collection_1.StringMapWrapper.set(result, 'segments', results);
    collection_1.StringMapWrapper.set(result, 'specificity', specificity);
    return result;
}
function splitBySlash(url) {
    return url.split('/');
}
var RESERVED_CHARS = lang_1.RegExpWrapper.create('//|\\(|\\)|;|\\?|=');
function assertPath(path) {
    if (lang_1.StringWrapper.contains(path, '#')) {
        throw new lang_1.BaseException("Path \"" + path + "\" should not include \"#\". Use \"HashLocationStrategy\" instead.");
    }
    var illegalCharacter = lang_1.RegExpWrapper.firstMatch(RESERVED_CHARS, path);
    if (lang_1.isPresent(illegalCharacter)) {
        throw new lang_1.BaseException("Path \"" + path + "\" contains \"" + illegalCharacter[0] + "\" which is not allowed in a route config.");
    }
}
// represents something like '/foo/:bar'
var PathRecognizer = (function () {
    function PathRecognizer(path, handler, isRoot) {
        var _this = this;
        if (isRoot === void 0) { isRoot = false; }
        this.path = path;
        this.handler = handler;
        this.isRoot = isRoot;
        this.terminal = true;
        assertPath(path);
        var parsed = parsePathString(path);
        var specificity = parsed['specificity'];
        var segments = parsed['segments'];
        var regexString = '^';
        collection_1.ListWrapper.forEach(segments, function (segment) {
            if (segment instanceof ContinuationSegment) {
                _this.terminal = false;
            }
            else {
                regexString += '/' + segment.regex;
            }
        });
        if (this.terminal) {
            regexString += '$';
        }
        this.regex = lang_1.RegExpWrapper.create(regexString);
        this.segments = segments;
        this.specificity = specificity;
    }
    PathRecognizer.prototype.parseParams = function (url) {
        // the last segment is always the star one since it's terminal
        var segmentsLimit = this.segments.length - 1;
        var containsStarSegment = segmentsLimit >= 0 && this.segments[segmentsLimit] instanceof StarSegment;
        var paramsString, useQueryString = this.isRoot && this.terminal;
        if (!containsStarSegment) {
            var matches = lang_1.RegExpWrapper.firstMatch(useQueryString ? PathRecognizer.queryRegex : PathRecognizer.matrixRegex, url);
            if (lang_1.isPresent(matches)) {
                url = matches[1];
                paramsString = matches[2];
            }
            url = lang_1.StringWrapper.replaceAll(url, /(;[^\/]+)(?=(\/|$))/g, '');
        }
        var params = collection_1.StringMapWrapper.create();
        var urlPart = url;
        for (var i = 0; i <= segmentsLimit; i++) {
            var segment = this.segments[i];
            if (segment instanceof ContinuationSegment) {
                continue;
            }
            var match = lang_1.RegExpWrapper.firstMatch(lang_1.RegExpWrapper.create('/' + segment.regex), urlPart);
            urlPart = lang_1.StringWrapper.substring(urlPart, match[0].length);
            if (segment.name.length > 0) {
                params[segment.name] = match[1];
            }
        }
        if (lang_1.isPresent(paramsString) && paramsString.length > 0) {
            var expectedStartingValue = useQueryString ? '?' : ';';
            if (paramsString[0] == expectedStartingValue) {
                helpers_1.parseAndAssignParamString(expectedStartingValue, paramsString, params);
            }
        }
        return params;
    };
    PathRecognizer.prototype.generate = function (params) {
        var paramTokens = new TouchMap(params);
        var applyLeadingSlash = false;
        var useQueryString = this.isRoot && this.terminal;
        var url = '';
        for (var i = 0; i < this.segments.length; i++) {
            var segment = this.segments[i];
            var s = segment.generate(paramTokens);
            applyLeadingSlash = applyLeadingSlash || (segment instanceof ContinuationSegment);
            if (s.length > 0) {
                url += (i > 0 ? '/' : '') + s;
            }
        }
        var unusedParams = paramTokens.getUnused();
        if (!collection_1.StringMapWrapper.isEmpty(unusedParams)) {
            url += useQueryString ? '?' : ';';
            var paramToken = useQueryString ? '&' : ';';
            var i = 0;
            collection_1.StringMapWrapper.forEach(unusedParams, function (value, key) {
                if (i++ > 0) {
                    url += paramToken;
                }
                url += key;
                if (!lang_1.isPresent(value) && useQueryString) {
                    value = 'true';
                }
                if (lang_1.isPresent(value)) {
                    url += '=' + value;
                }
            });
        }
        if (applyLeadingSlash) {
            url += '/';
        }
        return url;
    };
    PathRecognizer.prototype.resolveComponentType = function () { return this.handler.resolveComponentType(); };
    PathRecognizer.matrixRegex = lang_1.RegExpWrapper.create('^(.*\/[^\/]+?)(;[^\/]+)?\/?$');
    PathRecognizer.queryRegex = lang_1.RegExpWrapper.create('^(.*\/[^\/]+?)(\\?[^\/]+)?$');
    return PathRecognizer;
})();
exports.PathRecognizer = PathRecognizer;
//# sourceMappingURL=path_recognizer.js.map