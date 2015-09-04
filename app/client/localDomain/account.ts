/**
 * Created by cghislai on 02/09/15.
 */

import {Account, AccountType} from 'client/domain/account';
import {CompanyRef} from 'client/domain/company';
import {PosRef} from 'client/domain/pos';
import {LocaleTexts, LocaleTextsFactory} from 'client/utils/lang';

export class LocalAccount {
    id: number;
    companyRef: CompanyRef;
    accountingNumber: string;
    iban: string;
    bic: string;
    name: string;
    description: LocaleTexts;
    accountType: AccountType;

    accountTypeLabel: LocaleTexts;
}

export class LocalAccountFactory {
    static ACCOUNT_TYPE_OTHER_LABEL = {
        'fr': 'Autre'
    };
    static ACCOUNT_TYPE_VAT_LABEL = {
        'fr': 'TVA'
    };
    static ACCOUNT_TYPE_PAIMENT_LABEL = {
        'fr': 'Paiment'
    };
    static getAccountTypeLabel(accountType: AccountType) {
        switch (accountType) {
            case AccountType.OTHER: {
                return LocalAccountFactory.ACCOUNT_TYPE_OTHER_LABEL;
            }
            case AccountType.PAYMENT: {
                return LocalAccountFactory.ACCOUNT_TYPE_PAIMENT_LABEL;
            }
            case AccountType.VAT: {
                return LocalAccountFactory.ACCOUNT_TYPE_VAT_LABEL;
            }
        }
        return null;
    }

    static toLocalAccount(account: Account) {
        var localAccount = new LocalAccount();
        LocalAccountFactory.updateLocalAccount(localAccount, account);
        return localAccount;
    }

    static updateLocalAccount(localAccount: LocalAccount, account: Account) {
        localAccount.accountingNumber = account.accountingNumber;
        localAccount.accountType = AccountType[account.accountType];
        localAccount.accountTypeLabel = LocalAccountFactory.getAccountTypeLabel(localAccount.accountType);
        localAccount.bic = account.bic;
        localAccount.companyRef = account.companyRef;
        localAccount.description = account.description;
        localAccount.iban = account.iban;
        localAccount.id = account.id;
        localAccount.name = account.name;
    }

    static fromLocalAccount(localAccount: LocalAccount) {
        var account = new Account();
        account.accountingNumber = localAccount.accountingNumber;
        account.accountType = AccountType[localAccount.accountType];
        account.bic = localAccount.bic;
        account.companyRef = localAccount.companyRef;
        account.description = localAccount.description;
        account.iban = localAccount.iban;
        account.id = localAccount.id;
        account.name = localAccount.name;
        return account;
    }
}