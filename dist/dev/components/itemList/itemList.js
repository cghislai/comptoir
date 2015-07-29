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
var ItemList = (function () {
    function ItemList(itemService) {
        this.itemService = itemService;
        this.itemService.searchItems();
        this.searchItems();
    }
    ItemList.prototype.searchItems = function () {
        this.items = this.itemService.getItems();
    };
    ItemList.prototype.onFilterValueChanged = function ($event) {
        this.applyFilter($event.target.value);
    };
    ItemList.prototype.applyFilter = function (filterValue) {
        console.log(filterValue);
        this.items = this.itemService.findItems(filterValue);
    };
    ItemList = __decorate([
        angular2_1.Component({
            selector: 'itemList',
            viewInjector: [itemService_1.ItemService]
        }),
        angular2_1.View({
            templateUrl: './components/itemList/itemList.html',
            styleUrls: ['./components/itemList/itemList.css'],
            directives: [angular2_1.NgFor]
        }), 
        __metadata('design:paramtypes', [itemService_1.ItemService])
    ], ItemList);
    return ItemList;
})();
exports.ItemList = ItemList;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvaXRlbUxpc3QvaXRlbUxpc3QudHMiXSwibmFtZXMiOlsiSXRlbUxpc3QiLCJJdGVtTGlzdC5jb25zdHJ1Y3RvciIsIkl0ZW1MaXN0LnNlYXJjaEl0ZW1zIiwiSXRlbUxpc3Qub25GaWx0ZXJWYWx1ZUNoYW5nZWQiLCJJdGVtTGlzdC5hcHBseUZpbHRlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFHQSxBQUNBLG1EQURtRDtBQUNuRCx5QkFBcUMsbUJBQW1CLENBQUMsQ0FBQTtBQUN6RCw0QkFBZ0Msc0JBQXNCLENBQUMsQ0FBQTtBQUV2RDtJQWVJQSxrQkFBWUEsV0FBd0JBO1FBQ2hDQyxJQUFJQSxDQUFDQSxXQUFXQSxHQUFHQSxXQUFXQSxDQUFDQTtRQUMvQkEsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsV0FBV0EsRUFBRUEsQ0FBQ0E7UUFDL0JBLElBQUlBLENBQUNBLFdBQVdBLEVBQUVBLENBQUNBO0lBQ3ZCQSxDQUFDQTtJQUNERCw4QkFBV0EsR0FBWEE7UUFDSUUsSUFBSUEsQ0FBQ0EsS0FBS0EsR0FBR0EsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsUUFBUUEsRUFBRUEsQ0FBQ0E7SUFDN0NBLENBQUNBO0lBQ0RGLHVDQUFvQkEsR0FBcEJBLFVBQXFCQSxNQUFNQTtRQUN2QkcsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0E7SUFDMUNBLENBQUNBO0lBQ0RILDhCQUFXQSxHQUFYQSxVQUFZQSxXQUFtQkE7UUFDM0JJLE9BQU9BLENBQUNBLEdBQUdBLENBQUNBLFdBQVdBLENBQUNBLENBQUNBO1FBQ3pCQSxJQUFJQSxDQUFDQSxLQUFLQSxHQUFHQSxJQUFJQSxDQUFDQSxXQUFXQSxDQUFDQSxTQUFTQSxDQUFDQSxXQUFXQSxDQUFDQSxDQUFDQTtJQUN6REEsQ0FBQ0E7SUE3QkxKO1FBQUNBLG9CQUFTQSxDQUFDQTtZQUNQQSxRQUFRQSxFQUFFQSxVQUFVQTtZQUNwQkEsWUFBWUEsRUFBRUEsQ0FBQ0EseUJBQVdBLENBQUNBO1NBQzlCQSxDQUFDQTtRQUVEQSxlQUFJQSxDQUFDQTtZQUNGQSxXQUFXQSxFQUFFQSxxQ0FBcUNBO1lBQ2xEQSxTQUFTQSxFQUFFQSxDQUFDQSxvQ0FBb0NBLENBQUNBO1lBQ2pEQSxVQUFVQSxFQUFFQSxDQUFDQSxnQkFBS0EsQ0FBQ0E7U0FDdEJBLENBQUNBOztpQkFxQkRBO0lBQURBLGVBQUNBO0FBQURBLENBOUJBLEFBOEJDQSxJQUFBO0FBbkJZLGdCQUFRLFdBbUJwQixDQUFBIiwiZmlsZSI6ImNvbXBvbmVudHMvaXRlbUxpc3QvaXRlbUxpc3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENyZWF0ZWQgYnkgY2doaXNsYWkgb24gMjkvMDcvMTUuXG4gKi9cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi90eXBpbmdzL19jdXN0b20uZC50c1wiIC8+XG5pbXBvcnQge0NvbXBvbmVudCwgVmlldywgTmdGb3J9IGZyb20gJ2FuZ3VsYXIyL2FuZ3VsYXIyJztcbmltcG9ydCB7SXRlbSwgSXRlbVNlcnZpY2V9IGZyb20gJ3NlcnZpY2VzL2l0ZW1TZXJ2aWNlJztcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdpdGVtTGlzdCcsXG4gICAgdmlld0luamVjdG9yOiBbSXRlbVNlcnZpY2VdXG59KVxuXG5AVmlldyh7XG4gICAgdGVtcGxhdGVVcmw6ICcuL2NvbXBvbmVudHMvaXRlbUxpc3QvaXRlbUxpc3QuaHRtbCcsXG4gICAgc3R5bGVVcmxzOiBbJy4vY29tcG9uZW50cy9pdGVtTGlzdC9pdGVtTGlzdC5jc3MnXSxcbiAgICBkaXJlY3RpdmVzOiBbTmdGb3JdXG59KVxuXG5leHBvcnQgY2xhc3MgSXRlbUxpc3Qge1xuICAgIGl0ZW1TZXJ2aWNlOiBJdGVtU2VydmljZTtcbiAgICBpdGVtczogSXRlbVtdO1xuXG4gICAgY29uc3RydWN0b3IoaXRlbVNlcnZpY2U6IEl0ZW1TZXJ2aWNlKSB7XG4gICAgICAgIHRoaXMuaXRlbVNlcnZpY2UgPSBpdGVtU2VydmljZTtcbiAgICAgICAgdGhpcy5pdGVtU2VydmljZS5zZWFyY2hJdGVtcygpO1xuICAgICAgICB0aGlzLnNlYXJjaEl0ZW1zKCk7XG4gICAgfVxuICAgIHNlYXJjaEl0ZW1zKCkge1xuICAgICAgICB0aGlzLml0ZW1zID0gdGhpcy5pdGVtU2VydmljZS5nZXRJdGVtcygpO1xuICAgIH1cbiAgICBvbkZpbHRlclZhbHVlQ2hhbmdlZCgkZXZlbnQpIHtcbiAgICAgICAgdGhpcy5hcHBseUZpbHRlcigkZXZlbnQudGFyZ2V0LnZhbHVlKTtcbiAgICB9XG4gICAgYXBwbHlGaWx0ZXIoZmlsdGVyVmFsdWU6IHN0cmluZykge1xuICAgICAgICBjb25zb2xlLmxvZyhmaWx0ZXJWYWx1ZSk7XG4gICAgICAgIHRoaXMuaXRlbXMgPSB0aGlzLml0ZW1TZXJ2aWNlLmZpbmRJdGVtcyhmaWx0ZXJWYWx1ZSk7XG4gICAgfVxufVxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9