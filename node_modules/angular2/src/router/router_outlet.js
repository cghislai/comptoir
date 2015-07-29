'use strict';var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var async_1 = require('angular2/src/facade/async');
var collection_1 = require('angular2/src/facade/collection');
var lang_1 = require('angular2/src/facade/lang');
var decorators_1 = require('angular2/src/core/annotations/decorators');
var core_1 = require('angular2/core');
var di_1 = require('angular2/di');
var routerMod = require('./router');
var instruction_1 = require('./instruction');
var hookMod = require('./lifecycle_annotations');
var route_lifecycle_reflector_1 = require('./route_lifecycle_reflector');
/**
 * A router outlet is a placeholder that Angular dynamically fills based on the application's route.
 *
 * ## Use
 *
 * ```
 * <router-outlet></router-outlet>
 * ```
 */
var RouterOutlet = (function () {
    function RouterOutlet(_elementRef, _loader, _parentRouter, nameAttr) {
        this._elementRef = _elementRef;
        this._loader = _loader;
        this._parentRouter = _parentRouter;
        this.childRouter = null;
        this._componentRef = null;
        this._currentInstruction = null;
        // TODO: reintroduce with new // sibling routes
        // if (isBlank(nameAttr)) {
        //  nameAttr = 'default';
        //}
        this._parentRouter.registerOutlet(this);
    }
    /**
     * Given an instruction, update the contents of this outlet.
     */
    RouterOutlet.prototype.commit = function (instruction) {
        var _this = this;
        var next;
        if (instruction.reuse) {
            next = this._reuse(instruction);
        }
        else {
            next = this.deactivate(instruction).then(function (_) { return _this._activate(instruction); });
        }
        return next.then(function (_) { return _this._commitChild(instruction); });
    };
    RouterOutlet.prototype._commitChild = function (instruction) {
        if (lang_1.isPresent(this.childRouter)) {
            return this.childRouter.commit(instruction.child);
        }
        else {
            return async_1.PromiseWrapper.resolve(true);
        }
    };
    RouterOutlet.prototype._activate = function (instruction) {
        var _this = this;
        var previousInstruction = this._currentInstruction;
        this._currentInstruction = instruction;
        this.childRouter = this._parentRouter.childRouter(instruction.component);
        var bindings = di_1.Injector.resolve([
            di_1.bind(instruction_1.RouteParams)
                .toValue(new instruction_1.RouteParams(instruction.params())),
            di_1.bind(routerMod.Router).toValue(this.childRouter)
        ]);
        return this._loader.loadNextToLocation(instruction.component, this._elementRef, bindings)
            .then(function (componentRef) {
            _this._componentRef = componentRef;
            if (route_lifecycle_reflector_1.hasLifecycleHook(hookMod.onActivate, instruction.component)) {
                return _this._componentRef.instance.onActivate(instruction, previousInstruction);
            }
        });
    };
    /**
     * Called by Router during recognition phase
     */
    RouterOutlet.prototype.canDeactivate = function (nextInstruction) {
        if (lang_1.isBlank(this._currentInstruction)) {
            return async_1.PromiseWrapper.resolve(true);
        }
        if (route_lifecycle_reflector_1.hasLifecycleHook(hookMod.canDeactivate, this._currentInstruction.component)) {
            return async_1.PromiseWrapper.resolve(this._componentRef.instance.canDeactivate(nextInstruction, this._currentInstruction));
        }
        return async_1.PromiseWrapper.resolve(true);
    };
    /**
     * Called by Router during recognition phase
     */
    RouterOutlet.prototype.canReuse = function (nextInstruction) {
        var result;
        if (lang_1.isBlank(this._currentInstruction) ||
            this._currentInstruction.component != nextInstruction.component) {
            result = false;
        }
        else if (route_lifecycle_reflector_1.hasLifecycleHook(hookMod.canReuse, this._currentInstruction.component)) {
            result = this._componentRef.instance.canReuse(nextInstruction, this._currentInstruction);
        }
        else {
            result = nextInstruction == this._currentInstruction ||
                collection_1.StringMapWrapper.equals(nextInstruction.params(), this._currentInstruction.params());
        }
        return async_1.PromiseWrapper.resolve(result);
    };
    RouterOutlet.prototype._reuse = function (instruction) {
        var previousInstruction = this._currentInstruction;
        this._currentInstruction = instruction;
        return async_1.PromiseWrapper.resolve(route_lifecycle_reflector_1.hasLifecycleHook(hookMod.onReuse, this._currentInstruction.component) ?
            this._componentRef.instance.onReuse(instruction, previousInstruction) :
            true);
    };
    RouterOutlet.prototype.deactivate = function (nextInstruction) {
        var _this = this;
        return (lang_1.isPresent(this.childRouter) ?
            this.childRouter.deactivate(lang_1.isPresent(nextInstruction) ? nextInstruction.child :
                null) :
            async_1.PromiseWrapper.resolve(true))
            .then(function (_) {
            if (lang_1.isPresent(_this._componentRef) && lang_1.isPresent(_this._currentInstruction) &&
                route_lifecycle_reflector_1.hasLifecycleHook(hookMod.onDeactivate, _this._currentInstruction.component)) {
                return _this._componentRef.instance.onDeactivate(nextInstruction, _this._currentInstruction);
            }
        })
            .then(function (_) {
            if (lang_1.isPresent(_this._componentRef)) {
                _this._componentRef.dispose();
                _this._componentRef = null;
            }
        });
    };
    RouterOutlet = __decorate([
        decorators_1.Directive({ selector: 'router-outlet' }),
        __param(3, decorators_1.Attribute('name')), 
        __metadata('design:paramtypes', [core_1.ElementRef, core_1.DynamicComponentLoader, routerMod.Router, String])
    ], RouterOutlet);
    return RouterOutlet;
})();
exports.RouterOutlet = RouterOutlet;
//# sourceMappingURL=router_outlet.js.map