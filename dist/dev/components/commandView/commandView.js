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
var commandService_1 = require('services/commandService');
var CommandView = (function () {
    function CommandView(commandService) {
        this.commandService = commandService;
    }
    CommandView = __decorate([
        angular2_1.Component({
            selector: 'commandView'
        }),
        angular2_1.View({
            templateUrl: './components/commandView/commandView.html',
            styleUrls: ['./components/commandView/commandView.css'],
            directives: [angular2_1.NgFor, angular2_1.NgIf]
        }), 
        __metadata('design:paramtypes', [commandService_1.CommandService])
    ], CommandView);
    return CommandView;
})();
exports.CommandView = CommandView;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvY29tbWFuZFZpZXcvY29tbWFuZFZpZXcudHMiXSwibmFtZXMiOlsiQ29tbWFuZFZpZXciLCJDb21tYW5kVmlldy5jb25zdHJ1Y3RvciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFHQSxBQUNBLG1EQURtRDtBQUNuRCx5QkFBMkMsbUJBQW1CLENBQUMsQ0FBQTtBQUMvRCwrQkFBNkIseUJBQXlCLENBQUMsQ0FBQTtBQUV2RDtJQWVJQSxxQkFBWUEsY0FBOEJBO1FBQ3RDQyxJQUFJQSxDQUFDQSxjQUFjQSxHQUFHQSxjQUFjQSxDQUFDQTtJQUN6Q0EsQ0FBQ0E7SUFqQkxEO1FBQUNBLG9CQUFTQSxDQUFDQTtZQUNQQSxRQUFRQSxFQUFFQSxhQUFhQTtTQUMxQkEsQ0FBQ0E7UUFFREEsZUFBSUEsQ0FBQ0E7WUFDRkEsV0FBV0EsRUFBRUEsMkNBQTJDQTtZQUN4REEsU0FBU0EsRUFBRUEsQ0FBQ0EsMENBQTBDQSxDQUFDQTtZQUN2REEsVUFBVUEsRUFBRUEsQ0FBQ0EsZ0JBQUtBLEVBQUVBLGVBQUlBLENBQUNBO1NBQzVCQSxDQUFDQTs7b0JBV0RBO0lBQURBLGtCQUFDQTtBQUFEQSxDQW5CQSxBQW1CQ0EsSUFBQTtBQVJZLG1CQUFXLGNBUXZCLENBQUEiLCJmaWxlIjoiY29tcG9uZW50cy9jb21tYW5kVmlldy9jb21tYW5kVmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ3JlYXRlZCBieSBjZ2hpc2xhaSBvbiAyOS8wNy8xNS5cbiAqL1xuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL3R5cGluZ3MvX2N1c3RvbS5kLnRzXCIgLz5cbmltcG9ydCB7Q29tcG9uZW50LCBWaWV3LCBOZ0ZvciwgTmdJZn0gZnJvbSAnYW5ndWxhcjIvYW5ndWxhcjInO1xuaW1wb3J0IHtDb21tYW5kU2VydmljZX0gZnJvbSAnc2VydmljZXMvY29tbWFuZFNlcnZpY2UnO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ2NvbW1hbmRWaWV3J1xufSlcblxuQFZpZXcoe1xuICAgIHRlbXBsYXRlVXJsOiAnLi9jb21wb25lbnRzL2NvbW1hbmRWaWV3L2NvbW1hbmRWaWV3Lmh0bWwnLFxuICAgIHN0eWxlVXJsczogWycuL2NvbXBvbmVudHMvY29tbWFuZFZpZXcvY29tbWFuZFZpZXcuY3NzJ10sXG4gICAgZGlyZWN0aXZlczogW05nRm9yLCBOZ0lmXVxufSlcblxuXG5leHBvcnQgY2xhc3MgQ29tbWFuZFZpZXcge1xuXG4gICAgY29tbWFuZFNlcnZpY2U6IENvbW1hbmRTZXJ2aWNlO1xuXG4gICAgY29uc3RydWN0b3IoY29tbWFuZFNlcnZpY2U6IENvbW1hbmRTZXJ2aWNlKSB7XG4gICAgICAgIHRoaXMuY29tbWFuZFNlcnZpY2UgPSBjb21tYW5kU2VydmljZTtcbiAgICB9XG5cbn0iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=