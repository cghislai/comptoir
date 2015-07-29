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
var itemService_1 = require('services/itemService');
var commandService_1 = require('services/commandService');
var autoFocus_1 = require('directives/autoFocus');
var ItemList = (function () {
    function ItemList(itemService, commandService) {
        this.itemService = itemService;
        this.itemService.searchItems();
        this.commandService = commandService;
        this.searchItems();
    }
    ItemList.prototype.searchItems = function () {
        this.items = this.itemService.getItems();
    };
    ItemList.prototype.onFilterValueChanged = function ($event) {
        this.applyFilter($event.target.value);
    };
    ItemList.prototype.applyFilter = function (filterValue) {
        this.items = this.itemService.findItems(filterValue);
    };
    ItemList.prototype.onItemClick = function (item) {
        console.log(item);
        this.commandService.addItem(item);
    };
    ItemList = __decorate([
        angular2_1.Component({
            selector: 'itemList',
            viewInjector: [itemService_1.ItemService]
        }),
        angular2_1.View({
            templateUrl: './components/itemList/itemList.html',
            styleUrls: ['./components/itemList/itemList.css'],
            directives: [angular2_1.NgFor, autoFocus_1.AutoFocusDirective]
        }), 
        __metadata('design:paramtypes', [itemService_1.ItemService, commandService_1.CommandService])
    ], ItemList);
    return ItemList;
})();
exports.ItemList = ItemList;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvaXRlbUxpc3QvaXRlbUxpc3QudHMiXSwibmFtZXMiOlsiSXRlbUxpc3QiLCJJdGVtTGlzdC5jb25zdHJ1Y3RvciIsIkl0ZW1MaXN0LnNlYXJjaEl0ZW1zIiwiSXRlbUxpc3Qub25GaWx0ZXJWYWx1ZUNoYW5nZWQiLCJJdGVtTGlzdC5hcHBseUZpbHRlciIsIkl0ZW1MaXN0Lm9uSXRlbUNsaWNrIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUdBLEFBQ0EsbURBRG1EO0FBQ25ELHlCQUFtRCxtQkFBbUIsQ0FBQyxDQUFBO0FBQ3ZFLDRCQUFnQyxzQkFBc0IsQ0FBQyxDQUFBO0FBQ3ZELCtCQUE2Qix5QkFBeUIsQ0FBQyxDQUFBO0FBQ3ZELDBCQUFpQyxzQkFBc0IsQ0FBQyxDQUFBO0FBRXhEO0lBZ0JJQSxrQkFBWUEsV0FBd0JBLEVBQUVBLGNBQThCQTtRQUNoRUMsSUFBSUEsQ0FBQ0EsV0FBV0EsR0FBR0EsV0FBV0EsQ0FBQ0E7UUFDL0JBLElBQUlBLENBQUNBLFdBQVdBLENBQUNBLFdBQVdBLEVBQUVBLENBQUNBO1FBQy9CQSxJQUFJQSxDQUFDQSxjQUFjQSxHQUFHQSxjQUFjQSxDQUFDQTtRQUNyQ0EsSUFBSUEsQ0FBQ0EsV0FBV0EsRUFBRUEsQ0FBQ0E7SUFDdkJBLENBQUNBO0lBQ0RELDhCQUFXQSxHQUFYQTtRQUNJRSxJQUFJQSxDQUFDQSxLQUFLQSxHQUFHQSxJQUFJQSxDQUFDQSxXQUFXQSxDQUFDQSxRQUFRQSxFQUFFQSxDQUFDQTtJQUM3Q0EsQ0FBQ0E7SUFDREYsdUNBQW9CQSxHQUFwQkEsVUFBcUJBLE1BQU1BO1FBQ3ZCRyxJQUFJQSxDQUFDQSxXQUFXQSxDQUFDQSxNQUFNQSxDQUFDQSxNQUFNQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQTtJQUMxQ0EsQ0FBQ0E7SUFDREgsOEJBQVdBLEdBQVhBLFVBQVlBLFdBQW1CQTtRQUMzQkksSUFBSUEsQ0FBQ0EsS0FBS0EsR0FBR0EsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsU0FBU0EsQ0FBQ0EsV0FBV0EsQ0FBQ0EsQ0FBQ0E7SUFDekRBLENBQUNBO0lBQ0RKLDhCQUFXQSxHQUFYQSxVQUFZQSxJQUFVQTtRQUNsQkssT0FBT0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7UUFDbEJBLElBQUlBLENBQUNBLGNBQWNBLENBQUNBLE9BQU9BLENBQUNBLElBQUlBLENBQUNBLENBQUFBO0lBQ3JDQSxDQUFDQTtJQWxDTEw7UUFBQ0Esb0JBQVNBLENBQUNBO1lBQ1BBLFFBQVFBLEVBQUVBLFVBQVVBO1lBQ3BCQSxZQUFZQSxFQUFFQSxDQUFDQSx5QkFBV0EsQ0FBQ0E7U0FDOUJBLENBQUNBO1FBRURBLGVBQUlBLENBQUNBO1lBQ0ZBLFdBQVdBLEVBQUVBLHFDQUFxQ0E7WUFDbERBLFNBQVNBLEVBQUVBLENBQUNBLG9DQUFvQ0EsQ0FBQ0E7WUFDakRBLFVBQVVBLEVBQUVBLENBQUNBLGdCQUFLQSxFQUFFQSw4QkFBa0JBLENBQUNBO1NBQzFDQSxDQUFDQTs7aUJBMEJEQTtJQUFEQSxlQUFDQTtBQUFEQSxDQW5DQSxBQW1DQ0EsSUFBQTtBQXhCWSxnQkFBUSxXQXdCcEIsQ0FBQSIsImZpbGUiOiJjb21wb25lbnRzL2l0ZW1MaXN0L2l0ZW1MaXN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDcmVhdGVkIGJ5IGNnaGlzbGFpIG9uIDI5LzA3LzE1LlxuICovXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vdHlwaW5ncy9fY3VzdG9tLmQudHNcIiAvPlxuaW1wb3J0IHtDb21wb25lbnQsIFZpZXcsIE5nRm9yLCBFdmVudEVtaXR0ZXJ9IGZyb20gJ2FuZ3VsYXIyL2FuZ3VsYXIyJztcbmltcG9ydCB7SXRlbSwgSXRlbVNlcnZpY2V9IGZyb20gJ3NlcnZpY2VzL2l0ZW1TZXJ2aWNlJztcbmltcG9ydCB7Q29tbWFuZFNlcnZpY2V9IGZyb20gJ3NlcnZpY2VzL2NvbW1hbmRTZXJ2aWNlJztcbmltcG9ydCB7QXV0b0ZvY3VzRGlyZWN0aXZlfSBmcm9tICdkaXJlY3RpdmVzL2F1dG9Gb2N1cyc7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAnaXRlbUxpc3QnLFxuICAgIHZpZXdJbmplY3RvcjogW0l0ZW1TZXJ2aWNlXVxufSlcblxuQFZpZXcoe1xuICAgIHRlbXBsYXRlVXJsOiAnLi9jb21wb25lbnRzL2l0ZW1MaXN0L2l0ZW1MaXN0Lmh0bWwnLFxuICAgIHN0eWxlVXJsczogWycuL2NvbXBvbmVudHMvaXRlbUxpc3QvaXRlbUxpc3QuY3NzJ10sXG4gICAgZGlyZWN0aXZlczogW05nRm9yLCBBdXRvRm9jdXNEaXJlY3RpdmVdXG59KVxuXG5leHBvcnQgY2xhc3MgSXRlbUxpc3Qge1xuICAgIGl0ZW1TZXJ2aWNlOiBJdGVtU2VydmljZTtcbiAgICBpdGVtczogSXRlbVtdO1xuICAgIGNvbW1hbmRTZXJ2aWNlOiBDb21tYW5kU2VydmljZTtcblxuICAgIGNvbnN0cnVjdG9yKGl0ZW1TZXJ2aWNlOiBJdGVtU2VydmljZSwgY29tbWFuZFNlcnZpY2U6IENvbW1hbmRTZXJ2aWNlKSB7XG4gICAgICAgIHRoaXMuaXRlbVNlcnZpY2UgPSBpdGVtU2VydmljZTtcbiAgICAgICAgdGhpcy5pdGVtU2VydmljZS5zZWFyY2hJdGVtcygpO1xuICAgICAgICB0aGlzLmNvbW1hbmRTZXJ2aWNlID0gY29tbWFuZFNlcnZpY2U7XG4gICAgICAgIHRoaXMuc2VhcmNoSXRlbXMoKTtcbiAgICB9XG4gICAgc2VhcmNoSXRlbXMoKSB7XG4gICAgICAgIHRoaXMuaXRlbXMgPSB0aGlzLml0ZW1TZXJ2aWNlLmdldEl0ZW1zKCk7XG4gICAgfVxuICAgIG9uRmlsdGVyVmFsdWVDaGFuZ2VkKCRldmVudCkge1xuICAgICAgICB0aGlzLmFwcGx5RmlsdGVyKCRldmVudC50YXJnZXQudmFsdWUpO1xuICAgIH1cbiAgICBhcHBseUZpbHRlcihmaWx0ZXJWYWx1ZTogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuaXRlbXMgPSB0aGlzLml0ZW1TZXJ2aWNlLmZpbmRJdGVtcyhmaWx0ZXJWYWx1ZSk7XG4gICAgfVxuICAgIG9uSXRlbUNsaWNrKGl0ZW06IEl0ZW0pIHtcbiAgICAgICAgY29uc29sZS5sb2coaXRlbSk7XG4gICAgICAgIHRoaXMuY29tbWFuZFNlcnZpY2UuYWRkSXRlbShpdGVtKVxuICAgIH1cbn1cbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==