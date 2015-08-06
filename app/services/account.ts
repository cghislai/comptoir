/**
 * Created by cghislai on 06/08/15.
 */

import {Account,AccountType, AccountRef, AccountSearch} from 'client/domain/account';
import {AccountClient} from 'client/account';
import {LocaleText} from 'client/domain/lang';
import {SearchResult} from 'services/utils';

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
    label: any;
    constructor(accountType:AccountType, label: any) {
        this.type = accountType;
        this.label = label;
    }
}


export class AccountService {

    client:AccountClient;
    fakeData:Account[];
    accountTypes:any[];

    constructor() {
        this.client = new AccountClient();
        this.initFakeData();
    }

    findAccounts(accountSearch:AccountSearch):Promise<SearchResult<Account>> {
        // TODO: count
        var countPromise = new Promise<number>((resolve, reject)=> {
            resolve(10);
        });
        var searchPromise = this.client.findAccounts(accountSearch);
        var searchResults = new SearchResult();
        countPromise.then(function (count) {
            searchResults.totalCount = count;
        })
        searchPromise.then(function (results) {
            searchResults.results = results;
        });
        var thisService = this;
        var fakeSearchPromise = new Promise<Account[]>((resolve, reject) => {
            resolve(thisService.fakeData);
        }).then(function (results) {
                searchResults.results = results;
            });
        return Promise.all<any>([countPromise, fakeSearchPromise])
            .then(function () {
                return searchResults;
            });
    }

    getAccount(id:number):Promise<Account> {
        // TODO
        var thisService = this;
        return new Promise((resolve, reject)=> {
            resolve(thisService.fakeData[0]);
        })
        //return this.client.getAccount(id);
    }

    saveAccount(account:Account):Promise<AccountRef> {
        if (account.id == undefined) {
            return this.client.createAccount(account);
        }
        return this.client.updateAccount(account);
    }

    removeAccount(account:Account):Promise<boolean> {
        // TODO
        return new Promise((resolve, reject) => {
            resolve(true);
        });
    }

    private initAccounntTypes() {

    }

    private initFakeData() {
        this.fakeData = [];
        var account1 = new Account();
        account1.id = 0;
        account1.name = "Caisse";
        account1.accountingNumber = "1329189";
        account1.description = new LocaleText();
        account1.description.localeTextMap['fr'] = "Caisse du magasin";
        account1.accountType = AccountType.OTHER;
        this.fakeData[0] = account1;
    }
}