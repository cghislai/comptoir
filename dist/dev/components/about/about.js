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
var NameList_1 = require('../../services/NameList');
var About = (function () {
    function About(list) {
        this.list = list;
    }
    About.prototype.addName = function (newname) {
        this.list.add(newname.value);
        newname.value = '';
    };
    About = __decorate([
        angular2_1.Component({
            selector: 'component-2'
        }),
        angular2_1.View({
            templateUrl: './components/about/about.html?v=0.0.0',
            directives: [angular2_1.NgFor]
        }), 
        __metadata('design:paramtypes', [NameList_1.NamesList])
    ], About);
    return About;
})();
exports.About = About;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvYWJvdXQvYWJvdXQudHMiXSwibmFtZXMiOlsiQWJvdXQiLCJBYm91dC5jb25zdHJ1Y3RvciIsIkFib3V0LmFkZE5hbWUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUEsQUFDQSxtREFEbUQ7QUFDbkQseUJBQXFDLG1CQUFtQixDQUFDLENBQUE7QUFFekQseUJBQXdCLHlCQUF5QixDQUFDLENBQUE7QUFFbEQ7SUFRRUEsZUFBbUJBLElBQWVBO1FBQWZDLFNBQUlBLEdBQUpBLElBQUlBLENBQVdBO0lBQ2xDQSxDQUFDQTtJQUNERCx1QkFBT0EsR0FBUEEsVUFBUUEsT0FBT0E7UUFDYkUsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0E7UUFDN0JBLE9BQU9BLENBQUNBLEtBQUtBLEdBQUdBLEVBQUVBLENBQUNBO0lBQ3JCQSxDQUFDQTtJQWJIRjtRQUFDQSxvQkFBU0EsQ0FBQ0E7WUFDVEEsUUFBUUEsRUFBRUEsYUFBYUE7U0FDeEJBLENBQUNBO1FBQ0RBLGVBQUlBLENBQUNBO1lBQ0pBLFdBQVdBLEVBQUVBLGdEQUFnREE7WUFDN0RBLFVBQVVBLEVBQUVBLENBQUNBLGdCQUFLQSxDQUFDQTtTQUNwQkEsQ0FBQ0E7O2NBUURBO0lBQURBLFlBQUNBO0FBQURBLENBZEEsQUFjQ0EsSUFBQTtBQVBZLGFBQUssUUFPakIsQ0FBQSIsImZpbGUiOiJjb21wb25lbnRzL2Fib3V0L2Fib3V0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL3R5cGluZ3MvX2N1c3RvbS5kLnRzXCIgLz5cbmltcG9ydCB7Q29tcG9uZW50LCBWaWV3LCBOZ0Zvcn0gZnJvbSAnYW5ndWxhcjIvYW5ndWxhcjInO1xuXG5pbXBvcnQge05hbWVzTGlzdH0gZnJvbSAnLi4vLi4vc2VydmljZXMvTmFtZUxpc3QnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdjb21wb25lbnQtMidcbn0pXG5AVmlldyh7XG4gIHRlbXBsYXRlVXJsOiAnLi9jb21wb25lbnRzL2Fib3V0L2Fib3V0Lmh0bWw/dj08JT0gVkVSU0lPTiAlPicsXG4gIGRpcmVjdGl2ZXM6IFtOZ0Zvcl1cbn0pXG5leHBvcnQgY2xhc3MgQWJvdXQge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgbGlzdDogTmFtZXNMaXN0KSB7XG4gIH1cbiAgYWRkTmFtZShuZXduYW1lKSB7XG4gICAgdGhpcy5saXN0LmFkZChuZXduYW1lLnZhbHVlKTtcbiAgICBuZXduYW1lLnZhbHVlID0gJyc7XG4gIH1cbn0iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=