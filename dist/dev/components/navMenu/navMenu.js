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
/// <reference path="../../typings/_custom.d.ts" />
var angular2_1 = require('angular2/angular2');
var router_1 = require('angular2/router');
var NavMenu = (function () {
    function NavMenu() {
        this.menuVisible = false;
    }
    NavMenu.prototype.switchMenuVisibility = function () {
        this.menuVisible = !this.menuVisible;
    };
    NavMenu = __decorate([
        angular2_1.Component({
            selector: "navMenu"
        }),
        angular2_1.View({
            templateUrl: "./components/navMenu/navMenu.html",
            styleUrls: ["./components/navMenu/navMenu.css"],
            directives: [router_1.RouterLink]
        }), 
        __metadata('design:paramtypes', [])
    ], NavMenu);
    return NavMenu;
})();
exports.NavMenu = NavMenu;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvbmF2TWVudS9uYXZNZW51LnRzIl0sIm5hbWVzIjpbIk5hdk1lbnUiLCJOYXZNZW51LmNvbnN0cnVjdG9yIiwiTmF2TWVudS5zd2l0Y2hNZW51VmlzaWJpbGl0eSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFHQSxBQUNBLG1EQURtRDtBQUNuRCx5QkFBOEIsbUJBQW1CLENBQUMsQ0FBQTtBQUNsRCx1QkFBeUIsaUJBQWlCLENBQUMsQ0FBQTtBQUczQztJQVlJQTtRQUNJQyxJQUFJQSxDQUFDQSxXQUFXQSxHQUFHQSxLQUFLQSxDQUFDQTtJQUM3QkEsQ0FBQ0E7SUFDREQsc0NBQW9CQSxHQUFwQkE7UUFDSUUsSUFBSUEsQ0FBQ0EsV0FBV0EsR0FBR0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0E7SUFDekNBLENBQUNBO0lBakJMRjtRQUFDQSxvQkFBU0EsQ0FBQ0E7WUFDUEEsUUFBUUEsRUFBRUEsU0FBU0E7U0FDdEJBLENBQUNBO1FBQ0RBLGVBQUlBLENBQUNBO1lBQ0ZBLFdBQVdBLEVBQUVBLG1DQUFtQ0E7WUFDaERBLFNBQVNBLEVBQUVBLENBQUNBLGtDQUFrQ0EsQ0FBQ0E7WUFDL0NBLFVBQVVBLEVBQUVBLENBQUNBLG1CQUFVQSxDQUFDQTtTQUMzQkEsQ0FBQ0E7O2dCQVdEQTtJQUFEQSxjQUFDQTtBQUFEQSxDQWxCQSxBQWtCQ0EsSUFBQTtBQVRZLGVBQU8sVUFTbkIsQ0FBQSIsImZpbGUiOiJjb21wb25lbnRzL25hdk1lbnUvbmF2TWVudS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ3JlYXRlZCBieSBjZ2hpc2xhaSBvbiAyOS8wNy8xNS5cbiAqL1xuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL3R5cGluZ3MvX2N1c3RvbS5kLnRzXCIgLz5cbmltcG9ydCB7Q29tcG9uZW50LCBWaWV3fSBmcm9tICdhbmd1bGFyMi9hbmd1bGFyMic7XG5pbXBvcnQge1JvdXRlckxpbmt9IGZyb20gJ2FuZ3VsYXIyL3JvdXRlcic7XG5cblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6IFwibmF2TWVudVwiXG59KVxuQFZpZXcoe1xuICAgIHRlbXBsYXRlVXJsOiBcIi4vY29tcG9uZW50cy9uYXZNZW51L25hdk1lbnUuaHRtbFwiLFxuICAgIHN0eWxlVXJsczogW1wiLi9jb21wb25lbnRzL25hdk1lbnUvbmF2TWVudS5jc3NcIl0sXG4gICAgZGlyZWN0aXZlczogW1JvdXRlckxpbmtdXG59KVxuXG5leHBvcnQgY2xhc3MgTmF2TWVudSB7XG4gICAgbWVudVZpc2libGU6IGJvb2xlYW47XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5tZW51VmlzaWJsZSA9IGZhbHNlO1xuICAgIH1cbiAgICBzd2l0Y2hNZW51VmlzaWJpbGl0eSgpIHtcbiAgICAgICAgdGhpcy5tZW51VmlzaWJsZSA9ICF0aGlzLm1lbnVWaXNpYmxlO1xuICAgIH1cbn1cbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==