/**
 * Created by cghislai on 02/08/15.
 */
import {Component, View, FormBuilder, formDirectives, NgFor, NgIf} from 'angular2/angular2';

import {Account,AccountType, AccountSearch} from 'client/domain/account';
import {Balance, BalanceSearch} from 'client/domain/balance';
import {MoneyPile} from 'client/domain/moneyPile';
import {Pos, PosRef, PosSearch} from 'client/domain/pos';

import {ABalance, AMoneyPile, CashType} from 'client/utils/aBalance';
import {Pagination} from 'client/utils/pagination';
import {NumberUtils} from 'client/utils/number';

import {BalanceService} from 'services/balance';
import {PosService} from 'services/pos';
import {AccountService} from 'services/account';
import {ApplicationService} from 'services/application';

import {Paginator} from 'components/utils/paginator/paginator';
import {FastInput} from 'directives/fastInput'

@Component({
    selector: 'editCashView'
})
@View({
    templateUrl: './components/cash/count/countView.html',
    styleUrls: ['./components/cash/count/countView.css'],
    directives: [NgFor, NgIf, FastInput]
})

export class CountCashView {
    balanceService:BalanceService;
    posService:PosService;
    accountService:AccountService;
    appService:ApplicationService;

    aBalance:ABalance;
    editingTotal:boolean;

    posList:Pos[];
    pos:Pos;
    posId:number = -1;
    accountSearch:AccountSearch;
    accountList:Account[];
    account:Account;
    accountId:number = -1;
    lastBalance:Balance;
    language:string;

    constructor(applicationService:ApplicationService, balanceService:BalanceService,
                posService:PosService, accountService:AccountService) {
        this.balanceService = balanceService;
        this.posService = posService;
        this.accountService = accountService;
        this.appService = applicationService;

        this.aBalance = new ABalance();
        this.language = applicationService.language.locale;

        this.searchPosList();
        this.searchPaymentAccounts();
        this.searchLastBalance();
    }


    searchPosList() {
        this.setPos(this.posService.lastUsedPos);

        var posSearch = new PosSearch();
        this.posService.searchPos(posSearch, null)
            .then((result)=> {
                this.posList = result.list;
                if (this.pos == null && this.posList.length == 1) {
                    this.setPos(this.posList[0]);
                }
            }).catch((error)=> {
                this.appService.handleRequestError(error);
            });
    }

    setPos(pos:Pos) {
        if (this.pos == pos) {
            return;
        }
        this.pos = pos;
        this.posService.lastUsedPos = this.pos;
        if (pos == null) {
            this.posId = null;
            return;
        }
        this.posId = pos.id;
        this.searchPaymentAccounts();
        this.searchLastBalance();
    }

    onPosChanged(event) {
        var pos = null;
        var posId = event.target.value;
        for (var posItem of this.posList) {
            if (posItem.id == posId) {
                pos = posItem;
                break;
            }
        }
        this.setPos(pos);
    }

    searchPaymentAccounts() {
        this.setAccount(this.accountService.lastUsedBalanceAccount);

        this.accountSearch = new AccountSearch();
        this.accountSearch.type = AccountType[AccountType.PAYMENT];
        if (this.pos != null) {
            this.accountSearch.posRef = new PosRef(this.pos.id);
        }
        this.accountService.searchAccounts(this.accountSearch, null)
            .then((result)=> {
                this.accountList = result.list;
                if (this.account == null && this.accountList.length == 1) {
                    this.setAccount(this.accountList[0]);
                }
            }).catch((error)=> {
                this.appService.handleRequestError(error);
            });
    }

    setAccount(account:Account) {
        if (this.account == account) {
            return;
        }
        this.account = account;
        this.accountService.lastUsedBalanceAccount = account;
        this.aBalance.account = account;
        if (account == null) {
            this.accountId = null;
            return;
        }
        this.accountId = account.id;
        this.searchLastBalance();
    }


    onAccountChanged(event) {
        var account = null;
        var accountId = event.target.value;
        for (var accountItem of this.accountList) {
            if (accountItem.id == accountId) {
                account = accountItem;
                break;
            }
        }
        this.setAccount(account);
    }


    searchLastBalance() {
        if (this.account == null) {
            return;
        }
        var balanceSearch = new BalanceSearch();
        balanceSearch.accountSearch = this.accountSearch
        var pagination = new Pagination();
        pagination.firstIndex = 0;
        pagination.pageSize = 1;
        pagination.sorts = {
            'DATETIME': 'desc'
        };
        this.balanceService.searchBalancesAsync(balanceSearch, pagination)
            .then((result)=> {
                this.lastBalance = result[0];
            }).catch((error)=> {
                this.appService.handleRequestError(error);
            });
    }

    onCashInputChanged(aMoneyPile:AMoneyPile, event) {
        var amount = parseInt(event);
        if (isNaN(amount)) {
            amount = 0;
        }
        aMoneyPile.moneyPile.count = amount;
        this.balanceService.updateAMoneyPileAsync(aMoneyPile)
            .catch((error)=> {
                this.appService.handleRequestError(error);
            });
    }

    startEditTotal() {
        this.editingTotal = true;
    }


    onTotalChanged(event) {
        var total = parseFloat(event);
        if (!isNaN(total)) {
            total = NumberUtils.toFixedDecimals(total, 2);
            this.aBalance.total = total;
            if (this.aBalance.balance == null || this.aBalance.balance.id == null) {
                this.balanceService.openABalanceAsync(this.aBalance)
                    .catch((error)=> {
                        this.appService.handleRequestError(error);
                    });
            } else {
                this.balanceService.updateABalanceAsync(this.aBalance)
                    .catch((error)=> {
                        this.appService.handleRequestError(error);
                    });
            }
        }
        this.editingTotal = false;
    }

    closeBalance() {
        this.balanceService.closeABalanceAsync(this.aBalance)
            .catch((error)=> {
                this.appService.handleRequestError(error);
            });
    }
}