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
var applicationService_1 = require('services/applicationService');
var commandService_1 = require('services/commandService');
var itemList_1 = require('components/itemList/itemList');
var commandView_1 = require('components/commandView/commandView');
var SellView = (function () {
    function SellView(appService) {
        appService.pageName = "Vente";
    }
    SellView = __decorate([
        angular2_1.Component({
            selector: "sellView",
            viewInjector: [commandService_1.CommandService]
        }),
        angular2_1.View({
            templateUrl: "./components/sellView/sellView.html",
            styleUrls: ["./components/sellView/sellView.css"],
            directives: [itemList_1.ItemList, commandView_1.CommandView]
        }), 
        __metadata('design:paramtypes', [applicationService_1.ApplicationService])
    ], SellView);
    return SellView;
})();
exports.SellView = SellView;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvc2VsbFZpZXcvc2VsbFZpZXcudHMiXSwibmFtZXMiOlsiU2VsbFZpZXciLCJTZWxsVmlldy5jb25zdHJ1Y3RvciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFHQSxBQUNBLG1EQURtRDtBQUNuRCx5QkFBOEIsbUJBQW1CLENBQUMsQ0FBQTtBQUVsRCxtQ0FBaUMsNkJBQTZCLENBQUMsQ0FBQTtBQUMvRCwrQkFBNkIseUJBQXlCLENBQUMsQ0FBQTtBQUN2RCx5QkFBdUIsOEJBQThCLENBQUMsQ0FBQTtBQUN0RCw0QkFBMEIsb0NBQW9DLENBQUMsQ0FBQTtBQUUvRDtJQVlJQSxrQkFBWUEsVUFBOEJBO1FBQ3RDQyxVQUFVQSxDQUFDQSxRQUFRQSxHQUFHQSxPQUFPQSxDQUFDQTtJQUNsQ0EsQ0FBQ0E7SUFkTEQ7UUFBQ0Esb0JBQVNBLENBQUNBO1lBQ1BBLFFBQVFBLEVBQUVBLFVBQVVBO1lBQ3BCQSxZQUFZQSxFQUFFQSxDQUFDQSwrQkFBY0EsQ0FBQ0E7U0FDakNBLENBQUNBO1FBQ0RBLGVBQUlBLENBQUNBO1lBQ0ZBLFdBQVdBLEVBQUVBLHFDQUFxQ0E7WUFDbERBLFNBQVNBLEVBQUVBLENBQUNBLG9DQUFvQ0EsQ0FBQ0E7WUFDakRBLFVBQVVBLEVBQUVBLENBQUNBLG1CQUFRQSxFQUFFQSx5QkFBV0EsQ0FBQ0E7U0FDdENBLENBQUNBOztpQkFPREE7SUFBREEsZUFBQ0E7QUFBREEsQ0FmQSxBQWVDQSxJQUFBO0FBTFksZ0JBQVEsV0FLcEIsQ0FBQSIsImZpbGUiOiJjb21wb25lbnRzL3NlbGxWaWV3L3NlbGxWaWV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDcmVhdGVkIGJ5IGNnaGlzbGFpIG9uIDI5LzA3LzE1LlxuICovXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vdHlwaW5ncy9fY3VzdG9tLmQudHNcIiAvPlxuaW1wb3J0IHtDb21wb25lbnQsIFZpZXd9IGZyb20gJ2FuZ3VsYXIyL2FuZ3VsYXIyJztcblxuaW1wb3J0IHtBcHBsaWNhdGlvblNlcnZpY2V9IGZyb20gJ3NlcnZpY2VzL2FwcGxpY2F0aW9uU2VydmljZSc7XG5pbXBvcnQge0NvbW1hbmRTZXJ2aWNlfSBmcm9tICdzZXJ2aWNlcy9jb21tYW5kU2VydmljZSc7XG5pbXBvcnQge0l0ZW1MaXN0fSBmcm9tICdjb21wb25lbnRzL2l0ZW1MaXN0L2l0ZW1MaXN0JztcbmltcG9ydCB7Q29tbWFuZFZpZXd9IGZyb20gJ2NvbXBvbmVudHMvY29tbWFuZFZpZXcvY29tbWFuZFZpZXcnO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogXCJzZWxsVmlld1wiLFxuICAgIHZpZXdJbmplY3RvcjogW0NvbW1hbmRTZXJ2aWNlXVxufSlcbkBWaWV3KHtcbiAgICB0ZW1wbGF0ZVVybDogXCIuL2NvbXBvbmVudHMvc2VsbFZpZXcvc2VsbFZpZXcuaHRtbFwiLFxuICAgIHN0eWxlVXJsczogW1wiLi9jb21wb25lbnRzL3NlbGxWaWV3L3NlbGxWaWV3LmNzc1wiXSxcbiAgICBkaXJlY3RpdmVzOiBbSXRlbUxpc3QsIENvbW1hbmRWaWV3XVxufSlcblxuZXhwb3J0IGNsYXNzIFNlbGxWaWV3IHtcblxuICAgIGNvbnN0cnVjdG9yKGFwcFNlcnZpY2U6IEFwcGxpY2F0aW9uU2VydmljZSkge1xuICAgICAgICBhcHBTZXJ2aWNlLnBhZ2VOYW1lID0gXCJWZW50ZVwiO1xuICAgIH1cbn0iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=