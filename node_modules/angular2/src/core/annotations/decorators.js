'use strict';var annotations_1 = require('./annotations');
var view_1 = require('./view');
var di_1 = require('./di');
var decorators_1 = require('../../util/decorators');
/**
 * {@link Component} factory function.
 */
exports.Component = decorators_1.makeDecorator(annotations_1.ComponentAnnotation, function (fn) { return fn.View = exports.View; });
/**
 * {@link Directive} factory function.
 */
exports.Directive = decorators_1.makeDecorator(annotations_1.DirectiveAnnotation);
/**
 * {@link View} factory function.
 */
exports.View = decorators_1.makeDecorator(view_1.ViewAnnotation, function (fn) { return fn.View = exports.View; });
/**
 * {@link Attribute} factory function.
 */
exports.Attribute = decorators_1.makeParamDecorator(di_1.AttributeAnnotation);
/**
 * {@link Query} factory function.
 */
exports.Query = decorators_1.makeParamDecorator(di_1.QueryAnnotation);
/**
 * {@link ViewQuery} factory function.
 */
exports.ViewQuery = decorators_1.makeParamDecorator(di_1.ViewQueryAnnotation);
//# sourceMappingURL=decorators.js.map