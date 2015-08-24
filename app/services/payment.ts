/**
 * Created by cghislai on 16/08/15.
 */

import {Inject} from 'angular2/angular2';

import {Account, AccountRef, AccountSearch} from 'client/domain/account';
import {AccountingEntry, AccountingEntryRef, AccountingEntrySearch, AccountingEntryFactory} from 'client/domain/accountingEntry';
import {Pos, PosRef} from 'client/domain/pos';

import {ASale, ASalePay, ASalePayItem} from 'client/utils/aSale';
import {SearchResult} from 'client/utils/search';
import {ComptoirResponse} from 'client/utils/request';
import {NumberUtils} from 'client/utils/number';

import {AccountingEntryClient} from 'client/accountingEntry';
import {AccountClient} from 'client/account';

import {AuthService} from 'services/auth';


export class PaymentService {

    authService:AuthService;
    accountingEntryClient:AccountingEntryClient;
    accountClient:AccountClient;

    constructor(@Inject authService:AuthService) {
        this.authService = authService;
        this.accountingEntryClient = new AccountingEntryClient();
        this.accountClient = new AccountClient();
    }

    public createASalePay(aSale:ASale, pos:Pos):ASalePay {
        var salePay = new ASalePay();
        salePay.amount = 0;
        salePay.aSale = aSale;
        salePay.dirty = false;
        salePay.missingAmount = aSale.vatAmount + aSale.vatExclusive;
        salePay.payItems = [];
        salePay.pos = pos;
        salePay.searchItemsRequest = null;
        this.calcASalePay(salePay);
        return salePay;
    }

    public findASalePayItemsAsync(aSalePay:ASalePay):Promise<ASalePay> {
        aSalePay.dirty = true;
        this.calcASalePay(aSalePay);
        return this.findASalePayItemsAsyncPrivate(aSalePay)
            .then(()=>{
                aSalePay.dirty = false;
                this.calcASalePay(aSalePay);
                return aSalePay;
            });
    }

    public createASalePayItem(aSalePayItem:ASalePayItem):Promise<ASalePay> {
        var sale = aSalePayItem.aSalePay.aSale.sale;
        var account = aSalePayItem.account;
        var amount = aSalePayItem.amount;
        var aSalePay = aSalePayItem.aSalePay;

        var transactionRef = sale.accountingTransactionRef;
        var companyRef = this.authService.loggedEmployee.companyRef;

        var accountingEntry = new AccountingEntry();
        accountingEntry.accountingTransactionRef = transactionRef;
        accountingEntry.accountRef = new AccountRef(account.id);
        accountingEntry.companyRef = companyRef;
        accountingEntry.dateTime = new Date();
        accountingEntry.amount = amount;

        aSalePayItem.accountingEntry = accountingEntry;
        aSalePayItem.aSalePay = aSalePay;
        aSalePayItem.dirty = true;

        aSalePay.payItems.push(aSalePayItem);
        aSalePay.dirty = true;
        aSalePayItem.dirty = true;

        var promise = this.createASalePayItemAsync(aSalePayItem)
            .then(()=> {
                aSalePayItem.dirty = false;
                aSalePay.dirty = false;
                this.calcASalePay(aSalePay);
                // TODO: fetch back all items
                return aSalePay;
            });

        this.calcASalePay(aSalePay);
        return promise;
    }

    public setASalePayItemAmount(aSalePayItem:ASalePayItem, amount:number):Promise<ASalePay> {
        var aSalePay = aSalePayItem.aSalePay;
        aSalePayItem.amount = amount;
        aSalePayItem.dirty = true;
        aSalePay.dirty = true;

        var promise = this.updateASalePayItemAsync(aSalePayItem)
            .then(()=> {
                aSalePayItem.dirty = false;
                aSalePay.dirty = false;
                this.calcASalePay(aSalePay);
                return aSalePay;
            });

        this.calcASalePay(aSalePay);
        return promise;
    }

    public removeASalePayItem(aSalePayItem:ASalePayItem):Promise<ASalePay> {
        var aSalePay = aSalePayItem.aSalePay;
        this.removeItemFromPay(aSalePay, aSalePayItem);

        aSalePay.dirty = true;
        var promise = this.removeASalePayItemAsync(aSalePayItem)
            .then(()=> {
                // todo: refetch all items
                aSalePay.dirty = false;
                this.calcASalePay(aSalePay);
                return aSalePay;
            });

        this.calcASalePay(aSalePay);
        return promise;
    }


    ///

    private createASalePayItemAsync(aSalePayItem:ASalePayItem):Promise<ASalePayItem> {
        if (aSalePayItem.entryRequest != null) {
            aSalePayItem.entryRequest.discardRequest();
        }
        var accountingEntry = aSalePayItem.accountingEntry;
        var authToken = this.authService.authToken;

        aSalePayItem.entryRequest = this.accountingEntryClient.getCreateAccountingEntryRequest(accountingEntry, authToken);

        return aSalePayItem.entryRequest.run()
            .then((response:ComptoirResponse)=> {
                var entryRef:AccountingEntryRef = JSON.parse(response.text);
                aSalePayItem.entryRequest = null;
                aSalePayItem.accountingEntryId = entryRef.id;
                return this.fetchASalePayItemAsync(aSalePayItem);
            });
    }

    private fetchASalePayItemAsync(aSalePayItem:ASalePayItem):Promise<ASalePayItem> {
        if (aSalePayItem.entryRequest != null) {
            aSalePayItem.entryRequest.discardRequest();
        }
        var id = aSalePayItem.accountingEntryId;
        var authToken = this.authService.authToken;

        aSalePayItem.entryRequest = this.accountingEntryClient.getGetAccountingEntryRequest(id, authToken);
        return aSalePayItem.entryRequest.run()
            .then((response:ComptoirResponse)=> {
                var accountingEntry = JSON.parse(response.text, AccountingEntryFactory.fromJSONAccountingEntryReviver);
                this.setASalePayItemAcccountingEntry(aSalePayItem, accountingEntry);
                aSalePayItem.entryRequest = null;
                return aSalePayItem;
            });
    }


    private updateASalePayItemAsync(aSalePayItem:ASalePayItem):Promise<ASalePayItem> {
        if (aSalePayItem.entryRequest != null) {
            aSalePayItem.entryRequest.discardRequest();
        }
        var authToken = this.authService.authToken;
        this.updateASalePayItemAccountingEntry(aSalePayItem);

        aSalePayItem.entryRequest = this.accountingEntryClient.getUpdateAccountingEntryRequest(aSalePayItem.accountingEntry, authToken);
        return aSalePayItem.entryRequest.run()
            .then((response:ComptoirResponse)=> {
                var entryRef:AccountingEntryRef = JSON.parse(response.text);
                aSalePayItem.accountingEntryId = entryRef.id;
                aSalePayItem.entryRequest = null;
                return this.fetchASalePayItemAsync(aSalePayItem);
            });
    }

    private removeASalePayItemAsync(aSalePayItem:ASalePayItem):Promise<ASalePay> {
        if (aSalePayItem.entryRequest != null) {
            aSalePayItem.entryRequest.discardRequest();
        }
        var aSalePay = aSalePayItem.aSalePay;
        var authToken = this.authService.authToken;
        var id = aSalePayItem.accountingEntryId;

        aSalePayItem.entryRequest = this.accountingEntryClient.getDeleteAccountingEntryRequest(id, authToken);
        return aSalePayItem.entryRequest.run()
            .then((response:ComptoirResponse)=> {
                // Todo: fetch items
                return aSalePay;
            });
    }

    private setASalePayItemAcccountingEntry(aSalePayItem:ASalePayItem, accountingEntry:AccountingEntry) {
        aSalePayItem.accountingEntry = accountingEntry;
        aSalePayItem.accountingEntryId = accountingEntry.id;
        aSalePayItem.amount = accountingEntry.amount;
    }

    private updateASalePayItemAccountingEntry(aSalePayItem:ASalePayItem) {
        var accountingEntry = aSalePayItem.accountingEntry;
        accountingEntry.amount = aSalePayItem.amount;
    }

    private removeItemFromPay(aSalePay:ASalePay, item:ASalePayItem) {
        var newItems = [];
        var oldItems = aSalePay.payItems;
        for (var payitem of oldItems) {
            if (payitem != item) {
                newItems.push(payitem);
            }
        }
        aSalePay.payItems = newItems;
    }

    private findASalePayItemsAsyncPrivate(aSalePay:ASalePay):Promise<ASalePay> {
        if (aSalePay.searchItemsRequest != null) {
            aSalePay.searchItemsRequest.discardRequest();
        }

        var aSale = aSalePay.aSale;
        var sale = aSale.sale;
        var transactionRef = sale.accountingTransactionRef;
        var companyRef = this.authService.loggedEmployee.companyRef;
        var authToken = this.authService.authToken;

        var entrySearch = new AccountingEntrySearch();
        entrySearch.accountingTransactionRef = transactionRef;
        entrySearch.companyRef = companyRef;

        aSalePay.searchItemsRequest = this.accountingEntryClient.getSearchAccountingEntriesRequest(entrySearch, null, authToken);

        return aSalePay.searchItemsRequest.run()
            .then((response:ComptoirResponse)=> {
                var result = new SearchResult<AccountingEntry>()
                    .parseResponse(response, AccountingEntryFactory.fromJSONAccountingEntryReviver);
                return this.setASalePayItemsAsync(aSalePay, result);
            });
    }

    private setASalePayItemsAsync(aSalePay:ASalePay, result:SearchResult<AccountingEntry>):Promise<ASalePay> {
        aSalePay.payItems = [];
        var tasklist = [];
        var authToken = this.authService.authToken;
        for (var entry of result.list) {
            var payItem = new ASalePayItem();
            payItem.aSalePay = aSalePay;

            this.setASalePayItemAcccountingEntry(payItem, entry);
            aSalePay.payItems.push(payItem);

            var accountId = entry.accountRef.id;
            var fetchAccountTask = this.accountClient.getAccount(accountId, authToken)
                .then((account)=> {
                    payItem.account = account;
                });
            tasklist.push(fetchAccountTask);
        }
        return Promise.all(tasklist)
            .then(()=> {
                return aSalePay;
            });
    }

    private calcASalePay(aSalePay:ASalePay) {
        var totalPaid:number = 0;
        for (var payItem of aSalePay.payItems) {
            if (!payItem.dirty && payItem.accountingEntry != null) {
                var amount = payItem.accountingEntry.amount;
                totalPaid += amount;
                continue;
            }
            totalPaid += payItem.amount;
        }
        var aSale = aSalePay.aSale;
        var toPay = aSale.vatExclusive + aSale.vatAmount;

        totalPaid = NumberUtils.toFixedDecimals(totalPaid, 2);
        aSalePay.amount = totalPaid;
        var missingAmount = NumberUtils.toFixedDecimals(toPay - totalPaid, 2);
        aSalePay.missingAmount = missingAmount;
    }

}