/**
 * Created by cghislai on 02/08/15.
 */
import {Component, View, FormBuilder, formDirectives, NgFor, NgIf} from 'angular2/angular2';
import {RouteConfig, RouterOutlet, RouterLink, routerInjectables} from 'angular2/router';


import {CashService, CashState, CashTransaction} from 'services/cashService';
import {Pagination} from 'services/utils';
import {Paginator} from 'components/utils/paginator/paginator';
import {AutoFocusDirective} from 'directives/autoFocus'

enum CashType {
    ONE_CENT,
    TWO_CENT,
    FIVE_CENT,
    TEN_CENT,
    TWENTY_CENT,
    FIFTY_CENT,
    ONE_EURO,
    TWO_EURO,
    FIVE_EURO,
    TEN_EURO,
    TWENTY_EURO,
    FIFTY_EURO,
    ONE_HUNDRED_EURO,
    TWO_HUNDRED_EURO,
    FIVE_HUNDRED_EURO
}
class CashAmount {
    type: CashType;
    name: string;
    value: number;
    amount: number;
    constructor(type: CashType, name: string, value: number, amount: number) {
        this.type = type;
        this.name = name;
        this.value = value;
        this.amount = amount;
    }
}
class CashStateModel {
    static EMPTY_STATE: CashAmount[] = [
        new CashAmount(CashType.ONE_CENT, "1 cent", 0.01, 0),
        new CashAmount(CashType.TWO_CENT, "2 cent", 0.02, 0),
        new CashAmount(CashType.FIVE_CENT, "5 cent", 0.05, 0),
        new CashAmount(CashType.TEN_CENT, "10 cent", 0.1, 0),
        new CashAmount(CashType.TWENTY_CENT, "20 cent", 0.2, 0),
        new CashAmount(CashType.FIFTY_CENT, "50 cent", 0.5, 0),
        new CashAmount(CashType.ONE_EURO, "1 euro", 1, 0),
        new CashAmount(CashType.TWO_EURO, "2 euro", 2, 0),
        new CashAmount(CashType.FIVE_EURO, "5 euro", 5, 0),
        new CashAmount(CashType.TEN_EURO, "10 euro", 10, 0),
        new CashAmount(CashType.TWENTY_EURO, "20 euro", 20, 0),
        new CashAmount(CashType.FIFTY_EURO, "50 euro", 50, 0),
        new CashAmount(CashType.ONE_HUNDRED_EURO, "100 euro", 100, 0),
        new CashAmount(CashType.TWO_HUNDRED_EURO, "200 euro", 200, 0),
        new CashAmount(CashType.FIVE_HUNDRED_EURO, "500 euro", 500, 0),
    ];

    statePerType: CashAmount[];
    total: number;

    constructor() {
        var states = [];
        CashStateModel.EMPTY_STATE.forEach(function(state) {
            states.push(state);
        })
        this.statePerType = states;
    }
    calcTotal() {
        var total = 0;
        this.statePerType.forEach(function(cashAmount:CashAmount) {
            var cashtypeTotal = cashAmount.amount * cashAmount.value;
            total += cashtypeTotal;
        });
        this.total = total;
    }
}


@Component({
    selector: 'editCashView'
})
@View({
    templateUrl: './components/edit/editCash/editCashView.html',
    styleUrls: ['./components/edit/editCash/editCashView.css'],
    directives: [NgFor,NgIf, AutoFocusDirective]
})

export class EditCashView {
    cashService: CashService;
    stateModel: CashStateModel;
    expectedState: CashState;
    editingAmount: boolean;

    constructor(cashService: CashService) {
        this.cashService = cashService;
        this.stateModel = new CashStateModel();
        this.calcDiff();
        this.expectedState = this.cashService.applyTransactions(this.cashService.state);
    }

    calcDiff() {
        this.stateModel.calcTotal();
    }

    onCashInputChange(cashType: CashAmount, value) {
        if (cashType.amount == value) {
            return;
        }
        cashType.amount = value;
        this.calcDiff();
    }

    getDiffAbsValue():number {
        var diff = this.expectedState.amount - this.stateModel.total;
        return Math.abs(diff);
    }

    saveState() {
       this.expectedState.amount = this.stateModel.total;
        this.expectedState.date = new Date();
        this.cashService.saveCashState(this.expectedState);
    }
    editAmount() {
        this.editingAmount = true;
        if (this.stateModel.total == 0) {
            this.stateModel.total = null;
        }
    }
    setAmount(amountStr: string) {
        var amount: number = parseFloat(amountStr);
        if (amount == this.stateModel.total
        || isNaN(amount)) {
            this.editingAmount = false;
            return;
        }
        amount = Number((amount).toFixed(2));
        this.stateModel.total = amount;
        this.editingAmount = false;
    }
    onAmountKeyUp(event) {
        if (event.which == 13) { // Enter
            var amount: string = event.target.value;
            this.setAmount(amount);
            return;
        }
        if (event.which == 27) { // Escape
            this.editingAmount = false;
            return;
        }
    }

}