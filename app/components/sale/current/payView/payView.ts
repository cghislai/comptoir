/**
 * Created by cghislai on 29/07/15.
 */


import {Component, View, EventEmitter, NgFor, NgIf} from 'angular2/angular2';
import {CommandService, Command} from 'services/commandService'
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
    templateUrl: './components/sale/current/payView/payView.html',
    styleUrls: ['./components/sale/current/payView/payView.css'],
    directives: [NgFor, NgIf, AutoFocusDirective]
})

export class PayView {
    commandService: CommandService;
    command: Command;
    toPayAmount: number;
    paidAmount: number;
    paid= new EventEmitter();
    //cancelled= new EventEmitter();

    payList: Pay[];
    availablePayMethods: PayMethod[];
    editingPay: Pay;

    constructor() {
        this.reset();
    }

    payCommand(command: Command) {
        this.reset();
        this.command = command;
        this.calcRemaining();
    }
    reset() {
        this.availablePayMethods = [];
        this.availablePayMethods.push(PayMethod.CASH);
        this.availablePayMethods.push(PayMethod.CARD);
        this.availablePayMethods.push(PayMethod.PAYPAL);
        this.payList = [];
        this.editingPay = null;
        this.calcRemaining();
    }
    startEditPay(method: PayMethod) {
        if (this.editingPay != null) {
            this.cancelEditPay();
        }
        this.editingPay = this.removePayMethod(method);
        if (this.editingPay == null) {
            this.editingPay = new Pay();
            this.editingPay.method = method;
            this.editingPay.amount = this.toPayAmount;
        }
        this.setMethodAvailable(method, false);
    }
    cancelEditPay() {
        this.setMethodAvailable(this.editingPay.method, true);
        this.editingPay = null;
    }
    savePay() {
        if (this.editingPay.amount > 0) {
            this.payList.push(this.editingPay);
        } else {
            this.setMethodAvailable(this.editingPay.method, true);
        }
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
        if (this.command == null) {
            this.toPayAmount = 0;
            this.paidAmount = 0;
            return;
        }
        var total = this.command.totalPrice;
        var paidAmount : number =  0;
        this.payList.forEach(function(pay: Pay) {
            paidAmount = paidAmount +  pay.amount;
        })
        this.toPayAmount = Number((total - paidAmount).toFixed(2));
        this.paidAmount = Number((paidAmount).toFixed(2));
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
    removePayMethod(method: PayMethod) : Pay {
        var newPays: Pay[] = [];
        var removedPay:Pay = null
        this.payList.forEach(function(pay: Pay) {
            if (pay.method == method) {
                removedPay = pay;
                return;
            }
            newPays.push(pay);
        })
        this.payList = newPays;
        this.calcRemaining();
        return removedPay;
    }
    onValidateClicked() {
        // TODO: validate the paiment
       this.reset();
        this.paid.next(true);
    }
}