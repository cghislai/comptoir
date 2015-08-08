/**
 * Created by cghislai on 06/08/15.
 */
import {Inject} from 'angular2/angular2';

import {Account,AccountType, AccountRef, AccountSearch} from 'client/domain/account';
import {LocaleTexts} from 'client/utils/lang';
import {SearchResult} from 'client/utils/searchResult';
import {AccountClient} from 'client/account';

import {AuthService} from 'services/auth';

export class NamedAccountType {
    static OTHER = new NamedAccountType(AccountType.OTHER, {
        'fr': 'Autre'
    });
    static PAYMENT = new NamedAccountType(AccountType.PAYMENT, {
        'fr': 'Paiement'
    });
    static VAT = new NamedAccountType(AccountType.VAT, {
        'fr': 'TVA'
    });
    static ALL_TYPES=[NamedAccountType.OTHER, NamedAccountType.PAYMENT, NamedAccountType.VAT];

    static getNamedForType(accountType: AccountType): NamedAccountType {
        for (var namedType of  NamedAccountType.ALL_TYPES) {
            if (namedType.type == accountType) {
                return namedType;
            }
        }
        return null;
    }

    type: AccountType;
    label: LocaleTexts;
    constructor(accountType:AccountType, label: LocaleTexts) {
        this.type = accountType;
        this.label = label;
    }
}


export class AccountService {

    client:AccountClient;
    authService: AuthService;

    fakeData:Account[];

    constructor(@Inject authService: AuthService) {
        this.client = new AccountClient();
        this.authService = authService;
        this.initFakeData();
    }

    searchAccounts(accountSearch:AccountSearch):Promise<SearchResult<Account>> {
        //return this.client.searchAccounts(accountSearch);
        var thisService = this;
        var authToken  = this.authService.authToken.token;
        // FIXME
        return new Promise((resolve, reject)=>{
           var r = new SearchResult<Account>();
            r.count = 10;
            r.list = thisService.fakeData;
            resolve(r);
        });
    }

    getAccount(id:number):Promise<Account> {
        // TODO
        var thisService = this;
        var authToken  = this.authService.authToken.token;
        return new Promise((resolve, reject)=> {
            resolve(thisService.fakeData[0]);
        })
        //return this.client.getAccount(id);
    }

    saveAccount(account:Account):Promise<AccountRef> {
        var authToken  = this.authService.authToken.token;
        if (account.id == undefined) {
            return this.client.createAccount(account, authToken);
        }
        return this.client.updateAccount(account, authToken);
    }

    removeAccount(account:Account):Promise<boolean> {
        var authToken  = this.authService.authToken.token;
        // TODO
        return new Promise((resolve, reject) => {
            resolve(true);
        });
    }


    private initFakeData() {
        this.fakeData = [];
        var account1 = new Account();
        account1.id = 0;
        account1.name = "Caisse";
        account1.accountingNumber = "1329189";
        account1.description = new LocaleTexts();
        account1.description['fr'] = "Caisse du magasin";
        account1.accountType = AccountType.OTHER;
        this.fakeData[0] = account1;
    }
}