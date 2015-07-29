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
var NameList_1 = require('./services/NameList');
var applicationService_1 = require('./services/applicationService');
var home_1 = require('./components/home/home');
var about_1 = require('./components/about/about');
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
            viewInjector: [NameList_1.NamesList, applicationService_1.ApplicationService]
        }),
        router_1.RouteConfig([
            { path: '/home', component: home_1.Home, as: 'home' },
            { path: '/about', component: about_1.About, as: 'about' },
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC50cyJdLCJuYW1lcyI6WyJBcHAiLCJBcHAuY29uc3RydWN0b3IiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUEsQUFDQSw2Q0FENkM7QUFDN0MseUJBQTBDLG1CQUFtQixDQUFDLENBQUE7QUFDOUQsdUJBQXVFLGlCQUFpQixDQUFDLENBQUE7QUFLekYseUJBQXdCLHFCQUFxQixDQUFDLENBQUE7QUFDOUMsbUNBQWlDLCtCQUErQixDQUFDLENBQUE7QUFDakUscUJBQW1CLHdCQUF3QixDQUFDLENBQUE7QUFDNUMsc0JBQW9CLDBCQUEwQixDQUFDLENBQUE7QUFDL0Msd0JBQXNCLDhCQUE4QixDQUFDLENBQUE7QUFDckQseUJBQXVCLGdDQUFnQyxDQUFDLENBQUE7QUFFeEQ7SUFrQklBLGFBQVlBLFVBQTZCQTtRQUNyQ0MsSUFBSUEsQ0FBQ0EsVUFBVUEsR0FBR0EsVUFBVUEsQ0FBQ0E7UUFDN0JBLFVBQVVBLENBQUNBLE9BQU9BLEdBQUdBLFVBQVVBLENBQUNBO1FBQ2hDQSxVQUFVQSxDQUFDQSxVQUFVQSxHQUFHQSxLQUFLQSxDQUFDQTtRQUM5QkEsVUFBVUEsQ0FBQ0EsUUFBUUEsR0FBR0EsVUFBVUEsQ0FBQ0E7SUFDckNBLENBQUNBO0lBdkJMRDtRQUFDQSxvQkFBU0EsQ0FBQ0E7WUFDUEEsUUFBUUEsRUFBRUEsS0FBS0E7WUFDZkEsWUFBWUEsRUFBRUEsQ0FBQ0Esb0JBQVNBLEVBQUVBLHVDQUFrQkEsQ0FBQ0E7U0FDaERBLENBQUNBO1FBQ0RBLG9CQUFXQSxDQUFDQTtZQUNUQSxFQUFDQSxJQUFJQSxFQUFFQSxPQUFPQSxFQUFFQSxTQUFTQSxFQUFFQSxXQUFJQSxFQUFFQSxFQUFFQSxFQUFFQSxNQUFNQSxFQUFDQTtZQUM1Q0EsRUFBQ0EsSUFBSUEsRUFBRUEsUUFBUUEsRUFBRUEsU0FBU0EsRUFBRUEsYUFBS0EsRUFBRUEsRUFBRUEsRUFBRUEsT0FBT0EsRUFBQ0E7WUFDL0NBLEVBQUVBLElBQUlBLEVBQUVBLEdBQUdBLEVBQUVBLFNBQVNBLEVBQUVBLG1CQUFRQSxFQUFFQSxFQUFFQSxFQUFFQSxNQUFNQSxFQUFFQTtZQUM5Q0EsRUFBRUEsSUFBSUEsRUFBRUEsT0FBT0EsRUFBRUEsU0FBU0EsRUFBRUEsbUJBQVFBLEVBQUVBLEVBQUVBLEVBQUVBLE1BQU1BLEVBQUVBO1NBQ3JEQSxDQUFDQTtRQUNEQSxlQUFJQSxDQUFDQTtZQUNGQSxXQUFXQSxFQUFFQSw2QkFBNkJBO1lBQzFDQSxTQUFTQSxFQUFFQSxDQUFDQSxXQUFXQSxDQUFDQTtZQUN4QkEsVUFBVUEsRUFBRUEsQ0FBQ0EscUJBQVlBLEVBQUVBLG1CQUFVQSxFQUFFQSxpQkFBT0EsQ0FBQ0E7U0FDbERBLENBQUNBOztZQVVEQTtJQUFEQSxVQUFDQTtBQUFEQSxDQXhCQSxBQXdCQ0EsSUFBQTtBQUdELG9CQUFTLENBQUMsR0FBRyxFQUFFLENBQUMsMEJBQWlCLENBQUMsQ0FBQyxDQUFDIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJ0eXBpbmdzL19jdXN0b20uZC50c1wiIC8+XG5pbXBvcnQge0NvbXBvbmVudCwgVmlldywgIGJvb3RzdHJhcH0gZnJvbSAnYW5ndWxhcjIvYW5ndWxhcjInO1xuaW1wb3J0IHtSb3V0ZUNvbmZpZywgUm91dGVyT3V0bGV0LCBSb3V0ZXJMaW5rLCByb3V0ZXJJbmplY3RhYmxlc30gZnJvbSAnYW5ndWxhcjIvcm91dGVyJztcbi8vIFRPRE86IG9uY2UgdGhlIGQudHMgaXMgZml4ZWQsIHVzZSBzaGFkb3cgZG9tXG4vLyBpbXBvcnQgVmlld0VuY2Fwc3VsYXRpb25cblxuXG5pbXBvcnQge05hbWVzTGlzdH0gZnJvbSAnLi9zZXJ2aWNlcy9OYW1lTGlzdCc7XG5pbXBvcnQge0FwcGxpY2F0aW9uU2VydmljZX0gZnJvbSAnLi9zZXJ2aWNlcy9hcHBsaWNhdGlvblNlcnZpY2UnO1xuaW1wb3J0IHtIb21lfSBmcm9tICcuL2NvbXBvbmVudHMvaG9tZS9ob21lJztcbmltcG9ydCB7QWJvdXR9IGZyb20gJy4vY29tcG9uZW50cy9hYm91dC9hYm91dCc7XG5pbXBvcnQge05hdk1lbnV9IGZyb20gJy4vY29tcG9uZW50cy9uYXZNZW51L25hdk1lbnUnO1xuaW1wb3J0IHtTZWxsVmlld30gZnJvbSAnLi9jb21wb25lbnRzL3NlbGxWaWV3L3NlbGxWaWV3JztcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdhcHAnLFxuICAgIHZpZXdJbmplY3RvcjogW05hbWVzTGlzdCwgQXBwbGljYXRpb25TZXJ2aWNlXVxufSlcbkBSb3V0ZUNvbmZpZyhbXG4gICAge3BhdGg6ICcvaG9tZScsIGNvbXBvbmVudDogSG9tZSwgYXM6ICdob21lJ30sXG4gICAge3BhdGg6ICcvYWJvdXQnLCBjb21wb25lbnQ6IEFib3V0LCBhczogJ2Fib3V0J30sXG4gICAgeyBwYXRoOiAnLycsIGNvbXBvbmVudDogU2VsbFZpZXcsIGFzOiAnc2VsbCcgfSxcbiAgICB7IHBhdGg6ICcvc2VsbCcsIGNvbXBvbmVudDogU2VsbFZpZXcsIGFzOiAnc2VsbCcgfVxuXSlcbkBWaWV3KHtcbiAgICB0ZW1wbGF0ZVVybDogJy4vYXBwLmh0bWw/dj08JT0gVkVSU0lPTiAlPicsXG4gICAgc3R5bGVVcmxzOiBbJy4vYXBwLmNzcyddLFxuICAgIGRpcmVjdGl2ZXM6IFtSb3V0ZXJPdXRsZXQsIFJvdXRlckxpbmssIE5hdk1lbnVdXG59KVxuY2xhc3MgQXBwIHtcbiAgICBhcHBTZXJ2aWNlOkFwcGxpY2F0aW9uU2VydmljZTtcblxuICAgIGNvbnN0cnVjdG9yKGFwcFNlcnZpY2U6QXBwbGljYXRpb25TZXJ2aWNlKSB7XG4gICAgICAgIHRoaXMuYXBwU2VydmljZSA9IGFwcFNlcnZpY2U7XG4gICAgICAgIGFwcFNlcnZpY2UuYXBwTmFtZSA9IFwiQ29tcHRvaXJcIjtcbiAgICAgICAgYXBwU2VydmljZS5hcHBWZXJzaW9uID0gXCIwLjFcIjtcbiAgICAgICAgYXBwU2VydmljZS5wYWdlTmFtZSA9IFwiQ29tcHRvaXJcIjtcbiAgICB9XG59XG5cblxuYm9vdHN0cmFwKEFwcCwgW3JvdXRlckluamVjdGFibGVzXSk7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=