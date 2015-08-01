/**
 * Created by cghislai on 29/07/15.
 */
/// <reference path="../../../typings/_custom.d.ts" />

import {Component, View, EventEmitter, NgFor, NgIf} from 'angular2/angular2';
import {CommandService} from 'services/commandService'
import {AutoFocusDirective} from 'directives/autoFocus'

enum PayMethod  {
    CASH= 0,
    CARD= 1,
    PAYPAL= 2
};
class Pay {
    method: PayMethod;
    amount: number
}

@Component({
    selector: "payView",
    events: ['paid']
})
@View({
    templateUrl: './components/sell/payView/payView.html',
    styleUrls: ['./components/sell/payView/payView.css'],
    directives: [NgFor, NgIf, AutoFocusDirective]
})

export class PayView {
    commandService: CommandService;
    toPayAmount: number;
    paidAmount: number;
    paid= new EventEmitter();
    //cancelled= new EventEmitter();

    payList: Pay[];
    availablePayMethods: PayMethod[];
    editingPay: Pay;

    constructor(commandService: CommandService) {
        this.commandService = commandService;
        this.toPayAmount = commandService.totalPrice;

        this.availablePayMethods = [];
        this.availablePayMethods.push(PayMethod.CASH);
        this.availablePayMethods.push(PayMethod.CARD);
        this.availablePayMethods.push(PayMethod.PAYPAL);
        this.payList = [];
        this.editingPay = null;
        this.calcRemaining();
        console.log('INIT toPay: '+this.toPayAmount);
    }

    startEditPay(method: PayMethod) {
        if (this.editingPay != null) {
            this.cancelEditPay();
        }
        this.editingPay = new Pay();
        this.editingPay.method = method;
        this.editingPay.amount = null;
        this.setMethodAvailable(method, false);
    }
    cancelEditPay() {
        this.setMethodAvailable(this.editingPay.method, true);
        this.editingPay = null;
    }
    savePay() {
        this.payList.push(this.editingPay);
        this.editingPay = null;
        this.calcRemaining();
    }
    removePay(pay: Pay) {
        var newPayList : Pay[] = [];
        this.payList.forEach(function(existingPay: Pay) {
            if (existingPay == pay) {
                return;
            }
            newPayList.push(existingPay);
        })
        this.payList = newPayList;
        this.calcRemaining();
        this.setMethodAvailable(pay.method, true);
    }
    calcRemaining() {
        var total = this.commandService.totalPrice;
        var paidAmount : number =  0;
        this.payList.forEach(function(pay: Pay) {
            paidAmount = paidAmount +  pay.amount;
        })
        this.toPayAmount = total - paidAmount;
        this.paidAmount = paidAmount;
        console.log('toPay: '+this.toPayAmount);
    }
    setMethodAvailable(method: PayMethod, available: boolean) {
        var newMethods = [];
        this.availablePayMethods.forEach(function(payMethod: PayMethod) {
            if (payMethod == method) {
                return;
            }
            newMethods.push(payMethod);
        })
        if (available) {
            newMethods.push(method);
        }
        this.availablePayMethods = newMethods;
    }
    getPayMethodName(method: PayMethod) {
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
    }
    onPayAmountKeyUp(amount: string, event) {
        var amountNumber : number = parseFloat(amount);
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
    }
    onValidateClicked() {
        // TODO: validate the paiment
        this.paid.next(true);
    }
}