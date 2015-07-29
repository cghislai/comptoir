/**
 * Created by cghislai on 29/07/15.
 */
/// <reference path="../../typings/_custom.d.ts" />
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
var angular2_1 = require('angular2/angular2');
var commandService_1 = require('services/commandService');
var autoFocus_1 = require('directives/autoFocus');
var PayMethod;
(function (PayMethod) {
    PayMethod[PayMethod["CASH"] = 0] = "CASH";
    PayMethod[PayMethod["CARD"] = 1] = "CARD";
    PayMethod[PayMethod["PAYPAL"] = 2] = "PAYPAL";
})(PayMethod || (PayMethod = {}));
;
var Pay = (function () {
    function Pay() {
    }
    return Pay;
})();
var PayView = (function () {
    function PayView(commandService) {
        this.paid = new angular2_1.EventEmitter();
        this.commandService = commandService;
        this.toPayAmount = commandService.totalPrice;
        this.availablePayMethods = [];
        this.availablePayMethods.push(PayMethod.CASH);
        this.availablePayMethods.push(PayMethod.CARD);
        this.availablePayMethods.push(PayMethod.PAYPAL);
        this.payList = [];
        this.editingPay = null;
    }
    PayView.prototype.startEditPay = function (method) {
        if (this.editingPay != null) {
            this.cancelEditPay();
        }
        this.editingPay = new Pay();
        this.editingPay.method = method;
        this.editingPay.amount = null;
        this.setMethodAvailable(method, false);
    };
    PayView.prototype.cancelEditPay = function () {
        this.setMethodAvailable(this.editingPay.method, true);
        this.editingPay = null;
    };
    PayView.prototype.savePay = function () {
        this.payList.push(this.editingPay);
        this.editingPay = null;
        this.calcRemaining();
    };
    PayView.prototype.removePay = function (pay) {
        var newPayList = [];
        this.payList.forEach(function (existingPay) {
            if (existingPay == pay) {
                return;
            }
            newPayList.push(existingPay);
        });
        this.payList = newPayList;
        this.calcRemaining();
        this.setMethodAvailable(pay.method, true);
    };
    PayView.prototype.calcRemaining = function () {
        var total = this.commandService.totalPrice;
        var paidAmount = 0;
        this.payList.forEach(function (pay) {
            paidAmount = paidAmount + pay.amount;
        });
        this.toPayAmount = total - paidAmount;
        this.paidAmount = paidAmount;
    };
    PayView.prototype.setMethodAvailable = function (method, available) {
        var newMethods = [];
        this.availablePayMethods.forEach(function (payMethod) {
            if (payMethod == method) {
                return;
            }
            newMethods.push(payMethod);
        });
        if (available) {
            newMethods.push(method);
        }
        this.availablePayMethods = newMethods;
    };
    PayView.prototype.getPayMethodName = function (method) {
        switch (method) {
            case PayMethod.CARD: {
                return "Card";
            }
            case PayMethod.CASH: {
                return "Cash";
            }
            case PayMethod.PAYPAL: {
                return "PayPal";
            }
        }
    };
    PayView.prototype.onPayAmountKeyUp = function (amount, event) {
        var amountNumber = parseFloat(amount);
        switch (event.which) {
            case 13: {
                this.editingPay.amount = amountNumber;
                this.savePay();
                return;
            }
            case 27: {
                this.cancelEditPay();
                return;
            }
        }
    };
    PayView.prototype.onValidateClicked = function () {
        this.paid.next(true);
    };
    PayView = __decorate([
        angular2_1.Component({
            selector: "payView",
            events: ['paid']
        }),
        angular2_1.View({
            templateUrl: './components/payView/payView.html',
            styleUrls: ['./components/payView/payView.css'],
            directives: [angular2_1.NgFor, angular2_1.NgIf, autoFocus_1.AutoFocusDirective]
        }), 
        __metadata('design:paramtypes', [commandService_1.CommandService])
    ], PayView);
    return PayView;
})();
exports.PayView = PayView;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvcGF5Vmlldy9wYXlWaWV3LnRzIl0sIm5hbWVzIjpbIlBheU1ldGhvZCIsIlBheSIsIlBheS5jb25zdHJ1Y3RvciIsIlBheVZpZXciLCJQYXlWaWV3LmNvbnN0cnVjdG9yIiwiUGF5Vmlldy5zdGFydEVkaXRQYXkiLCJQYXlWaWV3LmNhbmNlbEVkaXRQYXkiLCJQYXlWaWV3LnNhdmVQYXkiLCJQYXlWaWV3LnJlbW92ZVBheSIsIlBheVZpZXcuY2FsY1JlbWFpbmluZyIsIlBheVZpZXcuc2V0TWV0aG9kQXZhaWxhYmxlIiwiUGF5Vmlldy5nZXRQYXlNZXRob2ROYW1lIiwiUGF5Vmlldy5vblBheUFtb3VudEtleVVwIiwiUGF5Vmlldy5vblZhbGlkYXRlQ2xpY2tlZCJdLCJtYXBwaW5ncyI6IkFBQUE7O0dBRUc7QUFDSCxtREFBbUQ7Ozs7Ozs7Ozs7OztBQUVuRCx5QkFBeUQsbUJBQW1CLENBQUMsQ0FBQTtBQUM3RSwrQkFBNkIseUJBQzdCLENBQUMsQ0FEcUQ7QUFDdEQsMEJBQWlDLHNCQUVqQyxDQUFDLENBRnNEO0FBRXZELElBQUssU0FJSjtBQUpELFdBQUssU0FBUztJQUNWQSx5Q0FBT0EsQ0FBQUE7SUFDUEEseUNBQU9BLENBQUFBO0lBQ1BBLDZDQUFTQSxDQUFBQTtBQUNiQSxDQUFDQSxFQUpJLFNBQVMsS0FBVCxTQUFTLFFBSWI7QUFBQSxDQUFDO0FBQ0Y7SUFBQUM7SUFHQUMsQ0FBQ0E7SUFBREQsVUFBQ0E7QUFBREEsQ0FIQSxBQUdDQSxJQUFBO0FBRUQ7SUFxQklFLGlCQUFZQSxjQUE4QkE7UUFQMUNDLFNBQUlBLEdBQUVBLElBQUlBLHVCQUFZQSxFQUFFQSxDQUFDQTtRQVFyQkEsSUFBSUEsQ0FBQ0EsY0FBY0EsR0FBR0EsY0FBY0EsQ0FBQ0E7UUFDckNBLElBQUlBLENBQUNBLFdBQVdBLEdBQUdBLGNBQWNBLENBQUNBLFVBQVVBLENBQUNBO1FBRTdDQSxJQUFJQSxDQUFDQSxtQkFBbUJBLEdBQUdBLEVBQUVBLENBQUNBO1FB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QSxLQUFLQTtRQUNsQ1MsSUFBSUEsWUFBWUEsR0FBWUEsVUFBVUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0E7UUFDL0NBLE1BQU1BLENBQUNBLENBQUNBLEtBQUtBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBO1lBQ2xCQSxLQUFLQSxFQUFFQSxFQUFFQSxDQUFDQTtnQkFDTkEsSUFBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsTUFBTUEsR0FBR0EsWUFBWUEsQ0FBQ0E7Z0JBQ3RDQSxJQUFJQSxDQUFDQSxPQUFPQSxFQUFFQSxDQUFDQTtnQkFDZkEsTUFBTUEsQ0FBQ0E7WUFDWEEsQ0FBQ0E7WUFDR0EsS0FBS0EsRUFBRUEsRUFBRUEsQ0FBQ0E7Z0JBQ05BLElBQUlBLENBQUNBLGFBQWFBLEVBQUVBLENBQUNBO2dCQUNyQkEsTUFBTUEsQ0FBQ0E7WUFDWEEsQ0FBQ0E7UUFDVEEsQ0FBQ0E7SUFDTEEsQ0FBQ0E7SUFDRFQsbUNBQWlCQSxHQUFqQkE7UUFFSVUsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7SUFDekJBLENBQUNBO0lBbkhMVjtRQUFDQSxvQkFBU0EsQ0FBQ0E7WUFDUEEsUUFBUUEsRUFBRUEsU0FBU0E7WUFDbkJBLE1BQU1BLEVBQUVBLENBQUNBLE1BQU1BLENBQUNBO1NBQ25CQSxDQUFDQTtRQUNEQSxlQUFJQSxDQUFDQTtZQUNGQSxXQUFXQSxFQUFFQSxtQ0FBbUNBO1lBQ2hEQSxTQUFTQSxFQUFFQSxDQUFDQSxrQ0FBa0NBLENBQUNBO1lBQy9DQSxVQUFVQSxFQUFFQSxDQUFDQSxnQkFBS0EsRUFBRUEsZUFBSUEsRUFBRUEsOEJBQWtCQSxDQUFDQTtTQUNoREEsQ0FBQ0E7O2dCQTRHREE7SUFBREEsY0FBQ0E7QUFBREEsQ0FwSEEsQUFvSENBLElBQUE7QUExR1ksZUFBTyxVQTBHbkIsQ0FBQSIsImZpbGUiOiJjb21wb25lbnRzL3BheVZpZXcvcGF5Vmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ3JlYXRlZCBieSBjZ2hpc2xhaSBvbiAyOS8wNy8xNS5cbiAqL1xuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL3R5cGluZ3MvX2N1c3RvbS5kLnRzXCIgLz5cblxuaW1wb3J0IHtDb21wb25lbnQsIFZpZXcsIEV2ZW50RW1pdHRlciwgTmdGb3IsIE5nSWZ9IGZyb20gJ2FuZ3VsYXIyL2FuZ3VsYXIyJztcbmltcG9ydCB7Q29tbWFuZFNlcnZpY2V9IGZyb20gJ3NlcnZpY2VzL2NvbW1hbmRTZXJ2aWNlJ1xuaW1wb3J0IHtBdXRvRm9jdXNEaXJlY3RpdmV9IGZyb20gJ2RpcmVjdGl2ZXMvYXV0b0ZvY3VzJ1xuXG5lbnVtIFBheU1ldGhvZCAge1xuICAgIENBU0g9IDAsXG4gICAgQ0FSRD0gMSxcbiAgICBQQVlQQUw9IDJcbn07XG5jbGFzcyBQYXkge1xuICAgIG1ldGhvZDogUGF5TWV0aG9kO1xuICAgIGFtb3VudDogbnVtYmVyXG59XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiBcInBheVZpZXdcIixcbiAgICBldmVudHM6IFsncGFpZCddXG59KVxuQFZpZXcoe1xuICAgIHRlbXBsYXRlVXJsOiAnLi9jb21wb25lbnRzL3BheVZpZXcvcGF5Vmlldy5odG1sJyxcbiAgICBzdHlsZVVybHM6IFsnLi9jb21wb25lbnRzL3BheVZpZXcvcGF5Vmlldy5jc3MnXSxcbiAgICBkaXJlY3RpdmVzOiBbTmdGb3IsIE5nSWYsIEF1dG9Gb2N1c0RpcmVjdGl2ZV1cbn0pXG5cbmV4cG9ydCBjbGFzcyBQYXlWaWV3IHtcbiAgICBjb21tYW5kU2VydmljZTogQ29tbWFuZFNlcnZpY2U7XG4gICAgdG9QYXlBbW91bnQ6IG51bWJlcjtcbiAgICBwYWlkQW1vdW50OiBudW1iZXI7XG4gICAgcGFpZD0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICAgIC8vY2FuY2VsbGVkPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgICBwYXlMaXN0OiBQYXlbXTtcbiAgICBhdmFpbGFibGVQYXlNZXRob2RzOiBQYXlNZXRob2RbXTtcbiAgICBlZGl0aW5nUGF5OiBQYXk7XG5cbiAgICBjb25zdHJ1Y3Rvcihjb21tYW5kU2VydmljZTogQ29tbWFuZFNlcnZpY2UpIHtcbiAgICAgICAgdGhpcy5jb21tYW5kU2VydmljZSA9IGNvbW1hbmRTZXJ2aWNlO1xuICAgICAgICB0aGlzLnRvUGF5QW1vdW50ID0gY29tbWFuZFNlcnZpY2UudG90YWxQcmljZTtcblxuICAgICAgICB0aGlzLmF2YWlsYWJsZVBheU1ldGhvZHMgPSBbXTtcbiAgICAgICAgdGhpcy5hdmFpbGFibGVQYXlNZXRob2RzLnB1c2goUGF5TWV0aG9kLkNBU0gpO1xuICAgICAgICB0aGlzLmF2YWlsYWJsZVBheU1ldGhvZHMucHVzaChQYXlNZXRob2QuQ0FSRCk7XG4gICAgICAgIHRoaXMuYXZhaWxhYmxlUGF5TWV0aG9kcy5wdXNoKFBheU1ldGhvZC5QQVlQQUwpO1xuICAgICAgICB0aGlzLnBheUxpc3QgPSBbXTtcbiAgICAgICAgdGhpcy5lZGl0aW5nUGF5ID0gbnVsbDtcbiAgICB9XG5cbiAgICBzdGFydEVkaXRQYXkobWV0aG9kOiBQYXlNZXRob2QpIHtcbiAgICAgICAgaWYgKHRoaXMuZWRpdGluZ1BheSAhPSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLmNhbmNlbEVkaXRQYXkoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmVkaXRpbmdQYXkgPSBuZXcgUGF5KCk7XG4gICAgICAgIHRoaXMuZWRpdGluZ1BheS5tZXRob2QgPSBtZXRob2Q7XG4gICAgICAgIHRoaXMuZWRpdGluZ1BheS5hbW91bnQgPSBudWxsO1xuICAgICAgICB0aGlzLnNldE1ldGhvZEF2YWlsYWJsZShtZXRob2QsIGZhbHNlKTtcbiAgICB9XG4gICAgY2FuY2VsRWRpdFBheSgpIHtcbiAgICAgICAgdGhpcy5zZXRNZXRob2RBdmFpbGFibGUodGhpcy5lZGl0aW5nUGF5Lm1ldGhvZCwgdHJ1ZSk7XG4gICAgICAgIHRoaXMuZWRpdGluZ1BheSA9IG51bGw7XG4gICAgfVxuICAgIHNhdmVQYXkoKSB7XG4gICAgICAgIHRoaXMucGF5TGlzdC5wdXNoKHRoaXMuZWRpdGluZ1BheSk7XG4gICAgICAgIHRoaXMuZWRpdGluZ1BheSA9IG51bGw7XG4gICAgICAgIHRoaXMuY2FsY1JlbWFpbmluZygpO1xuICAgIH1cbiAgICByZW1vdmVQYXkocGF5OiBQYXkpIHtcbiAgICAgICAgdmFyIG5ld1BheUxpc3QgOiBQYXlbXSA9IFtdO1xuICAgICAgICB0aGlzLnBheUxpc3QuZm9yRWFjaChmdW5jdGlvbihleGlzdGluZ1BheTogUGF5KSB7XG4gICAgICAgICAgICBpZiAoZXhpc3RpbmdQYXkgPT0gcGF5KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbmV3UGF5TGlzdC5wdXNoKGV4aXN0aW5nUGF5KTtcbiAgICAgICAgfSlcbiAgICAgICAgdGhpcy5wYXlMaXN0ID0gbmV3UGF5TGlzdDtcbiAgICAgICAgdGhpcy5jYWxjUmVtYWluaW5nKCk7XG4gICAgICAgIHRoaXMuc2V0TWV0aG9kQXZhaWxhYmxlKHBheS5tZXRob2QsIHRydWUpO1xuICAgIH1cbiAgICBjYWxjUmVtYWluaW5nKCkge1xuICAgICAgICB2YXIgdG90YWwgPSB0aGlzLmNvbW1hbmRTZXJ2aWNlLnRvdGFsUHJpY2U7XG4gICAgICAgIHZhciBwYWlkQW1vdW50IDogbnVtYmVyID0gIDA7XG4gICAgICAgIHRoaXMucGF5TGlzdC5mb3JFYWNoKGZ1bmN0aW9uKHBheTogUGF5KSB7XG4gICAgICAgICAgICBwYWlkQW1vdW50ID0gcGFpZEFtb3VudCArICBwYXkuYW1vdW50O1xuICAgICAgICB9KVxuICAgICAgICB0aGlzLnRvUGF5QW1vdW50ID0gdG90YWwgLSBwYWlkQW1vdW50O1xuICAgICAgICB0aGlzLnBhaWRBbW91bnQgPSBwYWlkQW1vdW50O1xuICAgIH1cbiAgICBzZXRNZXRob2RBdmFpbGFibGUobWV0aG9kOiBQYXlNZXRob2QsIGF2YWlsYWJsZTogYm9vbGVhbikge1xuICAgICAgICB2YXIgbmV3TWV0aG9kcyA9IFtdO1xuICAgICAgICB0aGlzLmF2YWlsYWJsZVBheU1ldGhvZHMuZm9yRWFjaChmdW5jdGlvbihwYXlNZXRob2Q6IFBheU1ldGhvZCkge1xuICAgICAgICAgICAgaWYgKHBheU1ldGhvZCA9PSBtZXRob2QpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBuZXdNZXRob2RzLnB1c2gocGF5TWV0aG9kKTtcbiAgICAgICAgfSlcbiAgICAgICAgaWYgKGF2YWlsYWJsZSkge1xuICAgICAgICAgICAgbmV3TWV0aG9kcy5wdXNoKG1ldGhvZCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5hdmFpbGFibGVQYXlNZXRob2RzID0gbmV3TWV0aG9kcztcbiAgICB9XG4gICAgZ2V0UGF5TWV0aG9kTmFtZShtZXRob2Q6IFBheU1ldGhvZCkge1xuICAgICAgICBzd2l0Y2ggKG1ldGhvZCkge1xuICAgICAgICAgICAgY2FzZSBQYXlNZXRob2QuQ0FSRDoge1xuICAgICAgICAgICAgICAgIHJldHVybiBcIkNhcmRcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhc2UgUGF5TWV0aG9kLkNBU0g6IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJDYXNoXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXNlIFBheU1ldGhvZC5QQVlQQUw6IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJQYXlQYWxcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBvblBheUFtb3VudEtleVVwKGFtb3VudDogc3RyaW5nLCBldmVudCkge1xuICAgICAgICB2YXIgYW1vdW50TnVtYmVyIDogbnVtYmVyID0gcGFyc2VGbG9hdChhbW91bnQpO1xuICAgICAgICBzd2l0Y2ggKGV2ZW50LndoaWNoKSB7XG4gICAgICAgICAgICBjYXNlIDEzOiB7XG4gICAgICAgICAgICAgICAgdGhpcy5lZGl0aW5nUGF5LmFtb3VudCA9IGFtb3VudE51bWJlcjtcbiAgICAgICAgICAgICAgICB0aGlzLnNhdmVQYXkoKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2FzZSAyNzoge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNhbmNlbEVkaXRQYXkoKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBvblZhbGlkYXRlQ2xpY2tlZCgpIHtcbiAgICAgICAgLy8gVE9ETzogdmFsaWRhdGUgdGhlIHBhaW1lbnRcbiAgICAgICAgdGhpcy5wYWlkLm5leHQodHJ1ZSk7XG4gICAgfVxufSJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==