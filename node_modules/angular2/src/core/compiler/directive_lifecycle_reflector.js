'use strict';var lang_1 = require('angular2/src/facade/lang');
var annotations_1 = require('angular2/src/core/annotations_impl/annotations');
function hasLifecycleHook(e, type, annotation) {
    if (lang_1.isPresent(annotation.lifecycle)) {
        return annotation.lifecycle.indexOf(e) !== -1;
    }
    else {
        if (!(type instanceof lang_1.Type))
            return false;
        var proto = type.prototype;
        switch (e) {
            case annotations_1.LifecycleEvent.onAllChangesDone:
                return !!proto.onAllChangesDone;
            case annotations_1.LifecycleEvent.onChange:
                return !!proto.onChange;
            case annotations_1.LifecycleEvent.onCheck:
                return !!proto.onCheck;
            case annotations_1.LifecycleEvent.onDestroy:
                return !!proto.onDestroy;
            case annotations_1.LifecycleEvent.onInit:
                return !!proto.onInit;
            default:
                return false;
        }
    }
}
exports.hasLifecycleHook = hasLifecycleHook;
//# sourceMappingURL=directive_lifecycle_reflector.js.map