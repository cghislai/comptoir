/**
 * Created by cghislai on 29/09/15.
 */
import {Component, View, NgFor, NgIf, EventEmitter, ChangeDetectionStrategy, OnInit} from 'angular2/angular2';

import {LocalAccount} from 'client/localDomain/account';
import {LocalBalance, LocalBalanceFactory, NewBalance} from 'client/localDomain/balance';
import {LocalMoneyPile, CashType, ALL_CASH_TYPES,
    NewMoneyPile, LocalMoneyPileFactory} from 'client/localDomain/moneyPile';

import {NumberUtils} from 'client/utils/number';

import {BalanceService} from 'services/balance';
import {MoneyPileService} from 'services/moneyPile';
import {ErrorService} from 'services/error';
import {AuthService} from 'services/auth';

import {MoneyPileCountComponent} from 'components/cash/moneyPile/moneyPileCount';
import {FastInput} from 'components/utils/fastInput';

import {List} from 'immutable';

@Component({
    selector: 'balanceCountComponent',
    properties: ['account'],
    events: ['validated', 'cancelled'],
    changeDetection: ChangeDetectionStrategy.Default
})
@View({
    templateUrl: './components/cash/balance/countComponent.html',
    styleUrls: ['./components/cash/balance/countComponent.css'],
    directives: [NgFor, NgIf, MoneyPileCountComponent, FastInput]
})

export class BalanceCountComponent {
    authService:AuthService;
    errorService:ErrorService;
    moneyPileService:MoneyPileService;
    balanceService:BalanceService;

    account:LocalAccount;
    balance:LocalBalance;
    moneyPiles:List<LocalMoneyPile>;

    editingTotal:boolean;

    validated = new EventEmitter();
    cancelled = new EventEmitter();

    constructor(authService:AuthService, errorService:ErrorService,
                moneyPileService:MoneyPileService, balanceService:BalanceService) {
        this.authService = authService;
        this.errorService = errorService;
        this.balanceService = balanceService;
        this.moneyPileService = moneyPileService;


    }

    onInit() {
        this.moneyPiles = List(ALL_CASH_TYPES)
            .map((cashType)=> {
                return NewMoneyPile({
                    account: this.account,
                    unitCount: null,
                    unitAmount: LocalMoneyPileFactory.getCashTypeUnitValue(cashType),
                    label: LocalMoneyPileFactory.getCashTypeLabel(cashType)
                });
            })
            .toList();
        this.balance = NewBalance({
            account: this.account,
            company: this.authService.getEmployeeCompany()
        });
    }

    onMoneyPileChanged(moneyPile) {
        var listIndex = this.moneyPiles
            .findIndex((inMoneyPile)=> {
                return inMoneyPile.unitAmount === moneyPile.unitAmount;
            });
        var CashType = ALL_CASH_TYPES[listIndex];

        this.saveBalanceIfRequired()
            .then((balance)=> {
                moneyPile = <LocalMoneyPile>moneyPile.set('balance', balance);
                return this.moneyPileService.save(moneyPile);
            })
            .then((ref:any)=> {
                var taskList:Promise<any>[] = <Promise<any>[]>[
                    this.moneyPileService.get(ref.id),
                    this.balanceService.get(this.balance.id)
                ];
                return Promise.all(taskList);
            })
            .then((results)=> {
                var newMoneyPile = results[0];
                newMoneyPile = newMoneyPile.set('label', LocalMoneyPileFactory.getCashTypeLabel(CashType));
                var newBalance = results[1];
                this.balance = newBalance;
                this.moneyPiles = this.moneyPiles.set(listIndex, newMoneyPile);
            })
            .catch((error)=> {
                this.errorService.handleRequestError(error);
            });
    }

    private saveBalanceIfRequired():Promise<LocalBalance> {
        if (this.balance.id != null) {
            return Promise.resolve(this.balance);
        }
        return this.balanceService.save(this.balance)
            .then((ref)=> {
                return this.balanceService.get(ref.id);
            })
            .then((balance:LocalBalance)=> {
                this.balance = balance;
                return balance;
            });
    }

    startEditTotal() {
        this.editingTotal = true;
    }

    onTotalCancelled() {
        this.editingTotal = false;
    }

    onTotalChanged(newValue) {
        var total = parseFloat(newValue);
        if (isNaN(total)) {
            this.editingTotal = false;
            return;
        }
        total = NumberUtils.toFixedDecimals(total, 2);
        var balanceJs = this.balance.toJS();
        balanceJs.balance = total;
        var newBalance = NewBalance(balanceJs);

        this.balanceService.save(newBalance)
            .then((ref)=> {
                return this.balanceService.get(ref.id);
            })
            .then((balance:LocalBalance)=> {
                this.balance = balance;
            })
            .catch((error)=> {
                this.errorService.handleRequestError(error);
            });
        this.editingTotal = false;
    }

    onValidateBalanceClicked() {
        this.balanceService.closeBalance(this.balance)
            .then((ref)=> {
                return this.balanceService.get(ref.id);
            })
            .then((balance:LocalBalance)=> {
                this.balance = balance;
                this.validated.next(balance);
            })
            .catch((error)=> {
                this.errorService.handleRequestError(error);
            });
    }

}