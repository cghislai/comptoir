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
/// <reference path="typings/_custom.d.ts" />
var angular2_1 = require('angular2/angular2');
var router_1 = require('angular2/router');
var applicationService_1 = require('./services/applicationService');
var navMenu_1 = require('./components/navMenu/navMenu');
var sellView_1 = require('./components/sellView/sellView');
var App = (function () {
    function App(appService) {
        this.appService = appService;
        appService.appName = "Comptoir";
        appService.appVersion = "0.1";
        appService.pageName = "Comptoir";
    }
    App = __decorate([
        angular2_1.Component({
            selector: 'app',
            viewInjector: [applicationService_1.ApplicationService]
        }),
        router_1.RouteConfig([
            { path: '/', component: sellView_1.SellView, as: 'sell' },
            { path: '/sell', component: sellView_1.SellView, as: 'sell' }
        ]),
        angular2_1.View({
            templateUrl: './app.html?v=0.0.0',
            styleUrls: ['./app.css'],
            directives: [router_1.RouterOutlet, router_1.RouterLink, navMenu_1.NavMenu]
        }), 
        __metadata('design:paramtypes', [applicationService_1.ApplicationService])
    ], App);
    return App;
})();
angular2_1.bootstrap(App, [router_1.routerInjectables]);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC50cyJdLCJuYW1lcyI6WyJBcHAiLCJBcHAuY29uc3RydWN0b3IiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUEsQUFDQSw2Q0FENkM7QUFDN0MseUJBQTBDLG1CQUFtQixDQUFDLENBQUE7QUFDOUQsdUJBQXVFLGlCQUFpQixDQUFDLENBQUE7QUFLekYsbUNBQWlDLCtCQUErQixDQUFDLENBQUE7QUFDakUsd0JBQXNCLDhCQUE4QixDQUFDLENBQUE7QUFDckQseUJBQXVCLGdDQUFnQyxDQUFDLENBQUE7QUFFeEQ7SUFnQklBLGFBQVlBLFVBQTZCQTtRQUNyQ0MsSUFBSUEsQ0FBQ0EsVUFBVUEsR0FBR0EsVUFBVUEsQ0FBQ0E7UUFDN0JBLFVBQVVBLENBQUNBLE9BQU9BLEdBQUdBLFVBQVVBLENBQUNBO1FBQ2hDQSxVQUFVQSxDQUFDQSxVQUFVQSxHQUFHQSxLQUFLQSxDQUFDQTtRQUM5QkEsVUFBVUEsQ0FBQ0EsUUFBUUEsR0FBR0EsVUFBVUEsQ0FBQ0E7SUFDckNBLENBQUNBO0lBckJMRDtRQUFDQSxvQkFBU0EsQ0FBQ0E7WUFDUEEsUUFBUUEsRUFBRUEsS0FBS0E7WUFDZkEsWUFBWUEsRUFBRUEsQ0FBQ0EsdUNBQWtCQSxDQUFDQTtTQUNyQ0EsQ0FBQ0E7UUFDREEsb0JBQVdBLENBQUNBO1lBQ1RBLEVBQUVBLElBQUlBLEVBQUVBLEdBQUdBLEVBQUVBLFNBQVNBLEVBQUVBLG1CQUFRQSxFQUFFQSxFQUFFQSxFQUFFQSxNQUFNQSxFQUFFQTtZQUM5Q0EsRUFBRUEsSUFBSUEsRUFBRUEsT0FBT0EsRUFBRUEsU0FBU0EsRUFBRUEsbUJBQVFBLEVBQUVBLEVBQUVBLEVBQUVBLE1BQU1BLEVBQUVBO1NBQ3JEQSxDQUFDQTtRQUNEQSxlQUFJQSxDQUFDQTtZQUNGQSxXQUFXQSxFQUFFQSw2QkFBNkJBO1lBQzFDQSxTQUFTQSxFQUFFQSxDQUFDQSxXQUFXQSxDQUFDQTtZQUN4QkEsVUFBVUEsRUFBRUEsQ0FBQ0EscUJBQVlBLEVBQUVBLG1CQUFVQSxFQUFFQSxpQkFBT0EsQ0FBQ0E7U0FDbERBLENBQUNBOztZQVVEQTtJQUFEQSxVQUFDQTtBQUFEQSxDQXRCQSxBQXNCQ0EsSUFBQTtBQUdELG9CQUFTLENBQUMsR0FBRyxFQUFFLENBQUMsMEJBQWlCLENBQUMsQ0FBQyxDQUFDIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJ0eXBpbmdzL19jdXN0b20uZC50c1wiIC8+XG5pbXBvcnQge0NvbXBvbmVudCwgVmlldywgIGJvb3RzdHJhcH0gZnJvbSAnYW5ndWxhcjIvYW5ndWxhcjInO1xuaW1wb3J0IHtSb3V0ZUNvbmZpZywgUm91dGVyT3V0bGV0LCBSb3V0ZXJMaW5rLCByb3V0ZXJJbmplY3RhYmxlc30gZnJvbSAnYW5ndWxhcjIvcm91dGVyJztcbi8vIFRPRE86IG9uY2UgdGhlIGQudHMgaXMgZml4ZWQsIHVzZSBzaGFkb3cgZG9tXG4vLyBpbXBvcnQgVmlld0VuY2Fwc3VsYXRpb25cblxuXG5pbXBvcnQge0FwcGxpY2F0aW9uU2VydmljZX0gZnJvbSAnLi9zZXJ2aWNlcy9hcHBsaWNhdGlvblNlcnZpY2UnO1xuaW1wb3J0IHtOYXZNZW51fSBmcm9tICcuL2NvbXBvbmVudHMvbmF2TWVudS9uYXZNZW51JztcbmltcG9ydCB7U2VsbFZpZXd9IGZyb20gJy4vY29tcG9uZW50cy9zZWxsVmlldy9zZWxsVmlldyc7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAnYXBwJyxcbiAgICB2aWV3SW5qZWN0b3I6IFtBcHBsaWNhdGlvblNlcnZpY2VdXG59KVxuQFJvdXRlQ29uZmlnKFtcbiAgICB7IHBhdGg6ICcvJywgY29tcG9uZW50OiBTZWxsVmlldywgYXM6ICdzZWxsJyB9LFxuICAgIHsgcGF0aDogJy9zZWxsJywgY29tcG9uZW50OiBTZWxsVmlldywgYXM6ICdzZWxsJyB9XG5dKVxuQFZpZXcoe1xuICAgIHRlbXBsYXRlVXJsOiAnLi9hcHAuaHRtbD92PTwlPSBWRVJTSU9OICU+JyxcbiAgICBzdHlsZVVybHM6IFsnLi9hcHAuY3NzJ10sXG4gICAgZGlyZWN0aXZlczogW1JvdXRlck91dGxldCwgUm91dGVyTGluaywgTmF2TWVudV1cbn0pXG5jbGFzcyBBcHAge1xuICAgIGFwcFNlcnZpY2U6QXBwbGljYXRpb25TZXJ2aWNlO1xuXG4gICAgY29uc3RydWN0b3IoYXBwU2VydmljZTpBcHBsaWNhdGlvblNlcnZpY2UpIHtcbiAgICAgICAgdGhpcy5hcHBTZXJ2aWNlID0gYXBwU2VydmljZTtcbiAgICAgICAgYXBwU2VydmljZS5hcHBOYW1lID0gXCJDb21wdG9pclwiO1xuICAgICAgICBhcHBTZXJ2aWNlLmFwcFZlcnNpb24gPSBcIjAuMVwiO1xuICAgICAgICBhcHBTZXJ2aWNlLnBhZ2VOYW1lID0gXCJDb21wdG9pclwiO1xuICAgIH1cbn1cblxuXG5ib290c3RyYXAoQXBwLCBbcm91dGVySW5qZWN0YWJsZXNdKTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==