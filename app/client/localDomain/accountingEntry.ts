/**
 * Created by cghislai on 02/09/15.
 */


import {LocalAccount} from 'client/localDomain/account';

import {AccountingEntry, AccountingEntryRef, AccountingEntryFactory} from 'client/domain/accountingEntry';
import {AccountRef} from 'client/domain/account';
import {CompanyRef} from 'client/domain/company';
import {AccountingTransactionRef} from 'client/domain/accountingTransaction';
import {CustomerRef} from 'client/domain/customer';
import {LocaleTexts, LocaleTextsFactory} from 'client/utils/lang';
import {ComptoirRequest} from 'client/utils/request';

export class LocalAccountingEntry {
    id: number;
    companyRef: CompanyRef;
    amount: number = 0;
    vatRate: number = 0;
    dateTime: Date;
    description: LocaleTexts = new LocaleTexts();
    accountingTransactionRef: AccountingTransactionRef;
    vatAccountingEntryRef: AccountingEntryRef;
    customerRef: CustomerRef;

    account: LocalAccount;
    accountRequest: ComptoirRequest;
}

export class LocalAccountingEntryFactory {
    static toLocalAccountingEntry(accountingEntry: AccountingEntry) {
        var localAccountingEntry = new LocalAccountingEntry();
        LocalAccountingEntryFactory.updateLocalAccountingEntry(localAccountingEntry, accountingEntry);
        return localAccountingEntry;
    }

    static updateLocalAccountingEntry(localAccountingEntry: LocalAccountingEntry, accountingEntry: AccountingEntry) {
        localAccountingEntry.accountingTransactionRef = accountingEntry.accountingTransactionRef;
        localAccountingEntry.amount = accountingEntry.amount;
        localAccountingEntry.companyRef = accountingEntry.companyRef;
        localAccountingEntry.customerRef  = accountingEntry.customerRef;
        localAccountingEntry.dateTime = accountingEntry.dateTime;
        localAccountingEntry.description = accountingEntry.description;
        localAccountingEntry.id = accountingEntry.id;
        localAccountingEntry.vatAccountingEntryRef = accountingEntry.vatAccountingEntryRef;
        localAccountingEntry.vatRate = accountingEntry.vatRate;
    }

    static fromLocalAccountingEntry(localAccountingEntry: LocalAccountingEntry) {
        var accountingEntry = new AccountingEntry();
        accountingEntry.accountingTransactionRef = localAccountingEntry.accountingTransactionRef;
        accountingEntry.accountRef = new AccountRef(localAccountingEntry.account.id);
        accountingEntry.amount = localAccountingEntry.amount;
        accountingEntry.companyRef = localAccountingEntry.companyRef;
        accountingEntry.customerRef = localAccountingEntry.customerRef;
        accountingEntry.dateTime = localAccountingEntry.dateTime;
        accountingEntry.description = localAccountingEntry.description;
        accountingEntry.id = localAccountingEntry.id;
        accountingEntry.vatAccountingEntryRef = localAccountingEntry.vatAccountingEntryRef;
        accountingEntry.vatRate = localAccountingEntry.vatRate;
        return accountingEntry;
    }
}