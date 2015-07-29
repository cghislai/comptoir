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
var payView_1 = require('components/payView/payView');
var SellView = (function () {
    function SellView(appService, commandService) {
        appService.pageName = "Vente";
        this.commandService = commandService;
        this.commandValidated = false;
    }
    SellView.prototype.onCommandValidated = function (validated) {
        this.commandValidated = validated;
    };
    SellView.prototype.onCommandPaid = function (event, view) {
        this.commandService.reset();
        this.commandValidated = false;
    };
    SellView = __decorate([
        angular2_1.Component({
            selector: "sellView",
            viewInjector: [commandService_1.CommandService]
        }),
        angular2_1.View({
            templateUrl: "./components/sellView/sellView.html",
            styleUrls: ["./components/sellView/sellView.css"],
            directives: [itemList_1.ItemList, commandView_1.CommandView, payView_1.PayView, angular2_1.NgIf]
        }), 
        __metadata('design:paramtypes', [applicationService_1.ApplicationService, commandService_1.CommandService])
    ], SellView);
    return SellView;
})();
exports.SellView = SellView;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvc2VsbFZpZXcvc2VsbFZpZXcudHMiXSwibmFtZXMiOlsiU2VsbFZpZXciLCJTZWxsVmlldy5jb25zdHJ1Y3RvciIsIlNlbGxWaWV3Lm9uQ29tbWFuZFZhbGlkYXRlZCIsIlNlbGxWaWV3Lm9uQ29tbWFuZFBhaWQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBR0EsQUFDQSxtREFEbUQ7QUFDbkQseUJBQW9DLG1CQUFtQixDQUFDLENBQUE7QUFFeEQsbUNBQWlDLDZCQUE2QixDQUFDLENBQUE7QUFDL0QsK0JBQTZCLHlCQUF5QixDQUFDLENBQUE7QUFFdkQseUJBQXVCLDhCQUE4QixDQUFDLENBQUE7QUFDdEQsNEJBQTBCLG9DQUFvQyxDQUFDLENBQUE7QUFDL0Qsd0JBQXNCLDRCQUV0QixDQUFDLENBRmlEO0FBRWxEO0lBY0lBLGtCQUFZQSxVQUE4QkEsRUFBRUEsY0FBOEJBO1FBQ3RFQyxVQUFVQSxDQUFDQSxRQUFRQSxHQUFHQSxPQUFPQSxDQUFDQTtRQUM5QkEsSUFBSUEsQ0FBQ0EsY0FBY0EsR0FBR0EsY0FBY0EsQ0FBQ0E7UUFDckNBLElBQUlBLENBQUNBLGdCQUFnQkEsR0FBR0EsS0FBS0EsQ0FBQ0E7SUFDbENBLENBQUNBO0lBRURELHFDQUFrQkEsR0FBbEJBLFVBQW1CQSxTQUFrQkE7UUFDakNFLElBQUlBLENBQUNBLGdCQUFnQkEsR0FBR0EsU0FBU0EsQ0FBQ0E7SUFDdENBLENBQUNBO0lBQ0RGLGdDQUFhQSxHQUFiQSxVQUFjQSxLQUFLQSxFQUFFQSxJQUFJQTtRQUNyQkcsSUFBSUEsQ0FBQ0EsY0FBY0EsQ0FBQ0EsS0FBS0EsRUFBRUEsQ0FBQ0E7UUFDNUJBLElBQUlBLENBQUNBLGdCQUFnQkEsR0FBR0EsS0FBS0EsQ0FBQ0E7SUFDbENBLENBQUNBO0lBMUJMSDtRQUFDQSxvQkFBU0EsQ0FBQ0E7WUFDUEEsUUFBUUEsRUFBRUEsVUFBVUE7WUFDcEJBLFlBQVlBLEVBQUVBLENBQUNBLCtCQUFjQSxDQUFDQTtTQUNqQ0EsQ0FBQ0E7UUFDREEsZUFBSUEsQ0FBQ0E7WUFDRkEsV0FBV0EsRUFBRUEscUNBQXFDQTtZQUNsREEsU0FBU0EsRUFBRUEsQ0FBQ0Esb0NBQW9DQSxDQUFDQTtZQUNqREEsVUFBVUEsRUFBRUEsQ0FBQ0EsbUJBQVFBLEVBQUVBLHlCQUFXQSxFQUFFQSxpQkFBT0EsRUFBRUEsZUFBSUEsQ0FBQ0E7U0FDckRBLENBQUNBOztpQkFvQkRBO0lBQURBLGVBQUNBO0FBQURBLENBNUJBLEFBNEJDQSxJQUFBO0FBbEJZLGdCQUFRLFdBa0JwQixDQUFBIiwiZmlsZSI6ImNvbXBvbmVudHMvc2VsbFZpZXcvc2VsbFZpZXcuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENyZWF0ZWQgYnkgY2doaXNsYWkgb24gMjkvMDcvMTUuXG4gKi9cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi90eXBpbmdzL19jdXN0b20uZC50c1wiIC8+XG5pbXBvcnQge0NvbXBvbmVudCwgVmlldywgTmdJZn0gZnJvbSAnYW5ndWxhcjIvYW5ndWxhcjInO1xuXG5pbXBvcnQge0FwcGxpY2F0aW9uU2VydmljZX0gZnJvbSAnc2VydmljZXMvYXBwbGljYXRpb25TZXJ2aWNlJztcbmltcG9ydCB7Q29tbWFuZFNlcnZpY2V9IGZyb20gJ3NlcnZpY2VzL2NvbW1hbmRTZXJ2aWNlJztcbmltcG9ydCB7SXRlbX0gZnJvbSAnc2VydmljZXMvaXRlbVNlcnZpY2UnO1xuaW1wb3J0IHtJdGVtTGlzdH0gZnJvbSAnY29tcG9uZW50cy9pdGVtTGlzdC9pdGVtTGlzdCc7XG5pbXBvcnQge0NvbW1hbmRWaWV3fSBmcm9tICdjb21wb25lbnRzL2NvbW1hbmRWaWV3L2NvbW1hbmRWaWV3JztcbmltcG9ydCB7UGF5Vmlld30gZnJvbSAnY29tcG9uZW50cy9wYXlWaWV3L3BheVZpZXcnXG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiBcInNlbGxWaWV3XCIsXG4gICAgdmlld0luamVjdG9yOiBbQ29tbWFuZFNlcnZpY2VdXG59KVxuQFZpZXcoe1xuICAgIHRlbXBsYXRlVXJsOiBcIi4vY29tcG9uZW50cy9zZWxsVmlldy9zZWxsVmlldy5odG1sXCIsXG4gICAgc3R5bGVVcmxzOiBbXCIuL2NvbXBvbmVudHMvc2VsbFZpZXcvc2VsbFZpZXcuY3NzXCJdLFxuICAgIGRpcmVjdGl2ZXM6IFtJdGVtTGlzdCwgQ29tbWFuZFZpZXcsIFBheVZpZXcsIE5nSWZdXG59KVxuXG5leHBvcnQgY2xhc3MgU2VsbFZpZXcge1xuICAgIGNvbW1hbmRTZXJ2aWNlOiBDb21tYW5kU2VydmljZTtcbiAgICBjb21tYW5kVmFsaWRhdGVkOiBib29sZWFuO1xuXG4gICAgY29uc3RydWN0b3IoYXBwU2VydmljZTogQXBwbGljYXRpb25TZXJ2aWNlLCBjb21tYW5kU2VydmljZTogQ29tbWFuZFNlcnZpY2UpIHtcbiAgICAgICAgYXBwU2VydmljZS5wYWdlTmFtZSA9IFwiVmVudGVcIjtcbiAgICAgICAgdGhpcy5jb21tYW5kU2VydmljZSA9IGNvbW1hbmRTZXJ2aWNlO1xuICAgICAgICB0aGlzLmNvbW1hbmRWYWxpZGF0ZWQgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBvbkNvbW1hbmRWYWxpZGF0ZWQodmFsaWRhdGVkOiBib29sZWFuKSB7XG4gICAgICAgIHRoaXMuY29tbWFuZFZhbGlkYXRlZCA9IHZhbGlkYXRlZDtcbiAgICB9XG4gICAgb25Db21tYW5kUGFpZChldmVudCwgdmlldykge1xuICAgICAgICB0aGlzLmNvbW1hbmRTZXJ2aWNlLnJlc2V0KCk7XG4gICAgICAgIHRoaXMuY29tbWFuZFZhbGlkYXRlZCA9IGZhbHNlO1xuICAgIH1cblxufSJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==