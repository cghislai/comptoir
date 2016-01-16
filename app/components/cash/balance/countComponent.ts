/**
 * Created by cghislai on 29/09/15.
 */
import {Component, EventEmitter, ChangeDetectionStrategy} from 'angular2/core';
import {NgFor, NgIf} from 'angular2/common';

import {LocalAccount} from '../../../client/localDomain/account';
import {LocalBalance, LocalBalanceFactory} from '../../../client/localDomain/balance';
import {LocalMoneyPile, ALL_CASH_TYPES, LocalMoneyPileFactory} from '../../../client/localDomain/moneyPile';

import {NumberUtils} from '../../../client/utils/number';

import {BalanceService} from '../../../services/balance';
import {MoneyPileService} from '../../../services/moneyPile';
import {ErrorService} from '../../../services/error';
import {AuthService} from '../../../services/auth';

import {MoneyPileCountComponent} from '../../cash/moneyPile/moneyPileCount';
import {FastInput} from '../../utils/fastInput';

import * as Immutable from 'immutable';

@Component({
    selector: 'balance-count-component',
    inputs: ['account'],
    outputs: ['validated', 'cancelled'],
    changeDetection: ChangeDetectionStrategy.Default,
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
    moneyPiles:Immutable.List<LocalMoneyPile>;

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

    ngOnInit() {
        this.moneyPiles = Immutable.List(ALL_CASH_TYPES)
            .map((cashType)=> {
                return LocalMoneyPileFactory.createNewMoneyPile({
                    account: this.account,
                    unitCount: null,
                    unitAmount: LocalMoneyPileFactory.getCashTypeUnitValue(cashType),
                    label: LocalMoneyPileFactory.getCashTypeLabel(cashType)
                });
            })
            .toList();
        this.balance = LocalBalanceFactory.createNewBalance({
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
        var newBalance = LocalBalanceFactory.createNewBalance(balanceJs);

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
        this.saveBalanceIfRequired()
            .then(()=> {
                return this.balanceService.closeBalance(this.balance);
            })
            .then((ref)=> {
                return this.balanceService.get(ref.id);
            })
            .then((balance:LocalBalance)=> {
                this.balance = balance;
                this.validated.emit(balance);
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

}
