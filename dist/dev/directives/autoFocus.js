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
/// <reference path="../typings/_custom.d.ts" />
var angular2_1 = require('angular2/angular2');
var AutoFocusDirective = (function () {
    function AutoFocusDirective(viewContainer) {
        this.viewContainer = viewContainer;
        viewContainer.element.nativeElement.focus();
        console.log(this);
    }
    AutoFocusDirective = __decorate([
        angular2_1.Directive({
            selector: 'input[autoFocus]'
        }), 
        __metadata('design:paramtypes', [angular2_1.ViewContainerRef])
    ], AutoFocusDirective);
    return AutoFocusDirective;
})();
exports.AutoFocusDirective = AutoFocusDirective;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRpcmVjdGl2ZXMvYXV0b0ZvY3VzLnRzIl0sIm5hbWVzIjpbIkF1dG9Gb2N1c0RpcmVjdGl2ZSIsIkF1dG9Gb2N1c0RpcmVjdGl2ZS5jb25zdHJ1Y3RvciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFHQSxBQUNBLGdEQURnRDtBQUNoRCx5QkFBMEMsbUJBQW1CLENBQUMsQ0FBQTtBQUc5RDtJQUtJQSw0QkFBWUEsYUFBK0JBO1FBQ3ZDQyxJQUFJQSxDQUFDQSxhQUFhQSxHQUFHQSxhQUFhQSxDQUFDQTtRQUNuQ0EsYUFBYUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsYUFBYUEsQ0FBQ0EsS0FBS0EsRUFBRUEsQ0FBQ0E7UUFDNUNBLE9BQU9BLENBQUNBLEdBQUdBLENBQUNBLElBQUlBLENBQUNBLENBQUNBO0lBQ3RCQSxDQUFDQTtJQVRMRDtRQUFDQSxvQkFBU0EsQ0FBQ0E7WUFDUEEsUUFBUUEsRUFBRUEsa0JBQWtCQTtTQUMvQkEsQ0FBQ0E7OzJCQVFEQTtJQUFEQSx5QkFBQ0E7QUFBREEsQ0FWQSxBQVVDQSxJQUFBO0FBUFksMEJBQWtCLHFCQU85QixDQUFBIiwiZmlsZSI6ImRpcmVjdGl2ZXMvYXV0b0ZvY3VzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDcmVhdGVkIGJ5IGNnaGlzbGFpIG9uIDI5LzA3LzE1LlxuICovXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vdHlwaW5ncy9fY3VzdG9tLmQudHNcIiAvPlxuaW1wb3J0IHtEaXJlY3RpdmUsIFZpZXdDb250YWluZXJSZWZ9IGZyb20gJ2FuZ3VsYXIyL2FuZ3VsYXIyJztcblxuLy8gQSBhdXRvZm9jdXMgZGlyZWN0aXZlIHRvIGZvY3VzIHJlZHVjdGlvbiBmaWVkc1xuQERpcmVjdGl2ZSh7XG4gICAgc2VsZWN0b3I6ICdpbnB1dFthdXRvRm9jdXNdJ1xufSlcbmV4cG9ydCBjbGFzcyBBdXRvRm9jdXNEaXJlY3RpdmUge1xuICAgIHZpZXdDb250YWluZXI6IFZpZXdDb250YWluZXJSZWY7XG4gICAgY29uc3RydWN0b3Iodmlld0NvbnRhaW5lcjogVmlld0NvbnRhaW5lclJlZikge1xuICAgICAgICB0aGlzLnZpZXdDb250YWluZXIgPSB2aWV3Q29udGFpbmVyO1xuICAgICAgICB2aWV3Q29udGFpbmVyLmVsZW1lbnQubmF0aXZlRWxlbWVudC5mb2N1cygpO1xuICAgICAgICBjb25zb2xlLmxvZyh0aGlzKTtcbiAgICB9XG59Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9