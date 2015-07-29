'use strict';/**
 * This indirection is needed to free up Component, etc symbols in the public API
 * to be used by the decorator versions of these annotations.
 */
var decorators_1 = require('angular2/src/util/decorators');
var lifecycle_annotations_impl_1 = require('./lifecycle_annotations_impl');
var lifecycle_annotations_impl_2 = require('./lifecycle_annotations_impl');
exports.canReuse = lifecycle_annotations_impl_2.canReuse;
exports.canDeactivate = lifecycle_annotations_impl_2.canDeactivate;
exports.onActivate = lifecycle_annotations_impl_2.onActivate;
exports.onReuse = lifecycle_annotations_impl_2.onReuse;
exports.onDeactivate = lifecycle_annotations_impl_2.onDeactivate;
exports.CanActivate = decorators_1.makeDecorator(lifecycle_annotations_impl_1.CanActivate);
//# sourceMappingURL=lifecycle_annotations.js.map