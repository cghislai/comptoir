/**
 * Created by cghislai on 02/08/15.
 */
import {Component, View, FormBuilder, FORM_DIRECTIVES, NgFor, NgIf} from 'angular2/angular2';

import {LocalAccount} from 'client/localDomain/account';
import {LocalBalance} from 'client/localDomain/balance';
import {LocalMoneyPile, CashType, ALL_CASH_TYPES, LocalMoneyPileFactory} from 'client/localDomain/moneyPile';

import {CompanyRef} from 'client/domain/company';
import {AccountSearch, AccountType, AccountFactory} from 'client/domain/account';
import {BalanceSearch} from 'client/domain/balance';
import {Pos, PosRef, PosSearch} from 'client/domain/pos';

import {SearchRequest, SearchResult} from 'client/utils/search';
import {NumberUtils} from 'client/utils/number';
import {Pagination} from 'client/utils/pagination';

import {BalanceService} from 'services/balance';
import {MoneyPileService} from 'services/moneyPile';
import {PosService} from 'services/pos';
import {AccountService} from 'services/account';
import {ErrorService} from 'services/error';
import {AuthService} from 'services/auth';

import {Paginator} from 'components/utils/paginator/paginator';
import {PosSelect} from 'components/pos/posSelect/posSelect';
import {FastInput} from 'components/utils/fastInput'

@Component({
    selector: 'editCashView'
})
@View({
    templateUrl: './routes/cash/count/countView.html',
    styleUrls: ['./routes/cash/count/countView.css'],
    directives: [NgFor, NgIf, FastInput, PosSelect]
})

export class CountCashView {
    balanceService:BalanceService;
    moneyPileService:MoneyPileService;
    posService:PosService;
    accountService:AccountService;
    errorService:ErrorService;
    authService:AuthService;

    balance:LocalBalance;
    editingTotal:boolean;
    moneyPileList:LocalMoneyPile[];

    pos:Pos;

    accountSearchRequest:SearchRequest<LocalAccount>;
    accountSearchResult:SearchResult<LocalAccount>;
    account:LocalAccount;
    accountId:number;

    balanceSearchRequest:SearchRequest<LocalBalance>;
    balanceSearchResult:SearchResult<LocalBalance>;
    lastBalance:LocalBalance;

    locale:string;

    constructor(errorService:ErrorService, balanceService:BalanceService, moneyPileservice:MoneyPileService,
                posService:PosService, accountService:AccountService, authService:AuthService) {
        this.balanceService = balanceService;
        this.moneyPileService = moneyPileservice;
        this.posService = posService;
        this.accountService = accountService;
        this.errorService = errorService;
        this.authService = authService;

        this.balance = new LocalBalance();
        this.moneyPileList = [];
        for (var cashType of ALL_CASH_TYPES) {
            var moneyPile:LocalMoneyPile = new LocalMoneyPile();
            moneyPile.unitAmount = LocalMoneyPileFactory.getCashTypeUnitValue(cashType);
            moneyPile.balance = this.balance;
            moneyPile.label = LocalMoneyPileFactory.getCashTypeLabel(cashType);
            this.moneyPileList.push(moneyPile);
        }

        this.accountSearchRequest = new SearchRequest<LocalAccount>();
        this.balanceSearchRequest = new SearchRequest<LocalBalance>();

        this.locale = authService.getEmployeeLanguage().locale;
        this.accountId = null;
        this.searchPaymentAccounts();
        this.searchLastBalance();
    }


    searchPaymentAccounts() {
        var accountSearch = new AccountSearch();
        accountSearch.type = AccountType[AccountType.PAYMENT];
        if (this.pos != null) {
            accountSearch.posRef = new PosRef(this.pos.id);
        }
        accountSearch.companyRef = this.authService.getEmployeeCompanyRef();
        this.accountSearchRequest.search = accountSearch;

        this.accountService.search(this.accountSearchRequest)
            .then((result:SearchResult<LocalAccount>)=> {
                this.accountSearchResult = result;
                if (this.account == null && result.count == 1) {
                    this.setAccount(result.list[0]);
                }
            }).catch((error)=> {
                this.errorService.handleRequestError(error);
            });
    }

    onPosChanged(pos:Pos) {
        if (this.pos == pos) {
            return;
        }
        this.pos = pos;
        this.searchPaymentAccounts();
        this.searchLastBalance();
    }


    setAccount(account:LocalAccount) {
        if (this.account == account) {
            return;
        }
        this.account = account;
        this.accountService.lastUsedBalanceAccount = account;
        this.balance.account = account;
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
        if (this.accountSearchResult == null) {
            return;
        }
        for (var accountItem of this.accountSearchResult.list) {
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
        balanceSearch.accountSearch = this.accountSearchRequest.search;
        balanceSearch.companyRef = this.authService.getEmployeeCompanyRef();
        var pagination = new Pagination();
        pagination.firstIndex = 0;
        pagination.pageSize = 1;
        pagination.sorts = {
            'DATETIME': 'desc'
        };
        this.balanceSearchRequest.search = balanceSearch;
        this.balanceSearchRequest.pagination = pagination;
        this.balanceService.search(this.balanceSearchRequest)
            .then((result:SearchResult<LocalBalance>)=> {
                this.balanceSearchResult = result;
                this.lastBalance = result.list[0];
            }).catch((error)=> {
                this.errorService.handleRequestError(error);
            });
    }

    onCashInputChanged(moneyPile:LocalMoneyPile, event) {
        var amount = parseInt(event);
        if (isNaN(amount)) {
            amount = 0;
        }
        moneyPile.count = amount;
        moneyPile.account = this.account;
        moneyPile.balance = this.balance;

        var balanceTask = Promise.resolve(this.balance);
        if (this.balance.id == null) {
            balanceTask = this.balanceService.save(this.balance);
        }
        balanceTask.then((balance)=> {
            moneyPile.balance = balance;
            return this.moneyPileService.save(moneyPile)
        }).then(()=> {
            this.moneyPileService.refresh(moneyPile);
            this.balanceService.refresh(this.balance);
        }).catch((error)=> {
            this.errorService.handleRequestError(error);
        });
    }

    startEditTotal() {
        this.editingTotal = true;
    }


    onTotalChanged(event) {
        var total = parseFloat(event);
        if (isNaN(total)) {
            this.editingTotal = false;
            return;
        }
        total = NumberUtils.toFixedDecimals(total, 2);
        this.balance.balance = total;
        this.balanceService.save(this.balance)
            .catch((error)=> {
                this.errorService.handleRequestError(error);
            });
        this.editingTotal = false;
    }

    closeBalance() {
        this.balanceService.closeBalance(this.balance)
            .then(()=>{
                // Rest
                this.balance = new LocalBalance();
                this.moneyPileList = [];
                for (var cashType of ALL_CASH_TYPES) {
                    var moneyPile:LocalMoneyPile = new LocalMoneyPile();
                    moneyPile.unitAmount = LocalMoneyPileFactory.getCashTypeUnitValue(cashType);
                    moneyPile.balance = this.balance;
                    moneyPile.label = LocalMoneyPileFactory.getCashTypeLabel(cashType);
                    this.moneyPileList.push(moneyPile);
                }
                this.account =  this.accountService.lastUsedBalanceAccount;
                this.balance.account = this.account;
                if (this.account == null) {
                    this.accountId = null;
                    return;
                }
                this.accountId = this.account.id;
                this.searchLastBalance();
            })
            .catch((error)=> {
                this.errorService.handleRequestError(error);
            });
    }
}