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
var Home = (function () {
    function Home() {
    }
    Home = __decorate([
        angular2_1.Component({
            selector: 'component-1'
        }),
        angular2_1.View({
            templateUrl: './components/home/home.html?v=0.0.0',
            directives: [router_1.RouterLink]
        }), 
        __metadata('design:paramtypes', [])
    ], Home);
    return Home;
})();
exports.Home = Home;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvaG9tZS9ob21lLnRzIl0sIm5hbWVzIjpbIkhvbWUiLCJIb21lLmNvbnN0cnVjdG9yIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLEFBQ0EsbURBRG1EO0FBQ25ELHlCQUE4QixtQkFBbUIsQ0FBQyxDQUFBO0FBQ2xELHVCQUF5QixpQkFBaUIsQ0FBQyxDQUFBO0FBRTNDO0lBQUFBO0lBT21CQyxDQUFDQTtJQVBwQkQ7UUFBQ0Esb0JBQVNBLENBQUNBO1lBQ1RBLFFBQVFBLEVBQUVBLGFBQWFBO1NBQ3hCQSxDQUFDQTtRQUNEQSxlQUFJQSxDQUFDQTtZQUNKQSxXQUFXQSxFQUFFQSw4Q0FBOENBO1lBQzNEQSxVQUFVQSxFQUFFQSxDQUFDQSxtQkFBVUEsQ0FBQ0E7U0FDekJBLENBQUNBOzthQUNrQkE7SUFBREEsV0FBQ0E7QUFBREEsQ0FQbkIsQUFPb0JBLElBQUE7QUFBUCxZQUFJLE9BQUcsQ0FBQSIsImZpbGUiOiJjb21wb25lbnRzL2hvbWUvaG9tZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi90eXBpbmdzL19jdXN0b20uZC50c1wiIC8+XG5pbXBvcnQge0NvbXBvbmVudCwgVmlld30gZnJvbSAnYW5ndWxhcjIvYW5ndWxhcjInO1xuaW1wb3J0IHtSb3V0ZXJMaW5rfSBmcm9tICdhbmd1bGFyMi9yb3V0ZXInO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdjb21wb25lbnQtMSdcbn0pXG5AVmlldyh7XG4gIHRlbXBsYXRlVXJsOiAnLi9jb21wb25lbnRzL2hvbWUvaG9tZS5odG1sP3Y9PCU9IFZFUlNJT04gJT4nLFxuICBkaXJlY3RpdmVzOiBbUm91dGVyTGlua11cbn0pXG5leHBvcnQgY2xhc3MgSG9tZSB7fVxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9