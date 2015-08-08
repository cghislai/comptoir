/**
 * Created by cghislai on 04/08/15.
 */

import {CompanyRef, CompanyFactory} from 'client/domain/company';
import {LocaleText, LocaleTextFactory} from 'client/domain/lang';
import {Pagination} from 'client/utils/pagination';
import {LocaleTexts, LocaleTextsFactory} from 'client/utils/lang';

export enum AccountType {
    PAYMENT,
    VAT,
    OTHER
}

export class Account {
    id: number;
    company: CompanyRef;
    accountingNumber: string;
    iban: string;
    bic: string;
    name: string;
    description: LocaleTexts;
    accountType: AccountType;
}

export class AccountRef {
    id: number;
    link: string;
}

export class AccountSearch {
    companyRef: CompanyRef;
    pagination: Pagination;
}


export class AccountFactory {
    static getAccountTypeFromString(type: string) : AccountType {
        if (type === undefined) {
            return undefined;
        }
        if (type == 'PAYMENT') {
            return AccountType.PAYMENT;
        }
        if (type == 'VAR') {
            return AccountType.VAT;
        }
        if (type == 'OTHER') {
            return AccountType.OTHER;
        }
        return undefined;
    }

    static getAccountRefFromJSON(jsonObject: any) : AccountRef {
        if (jsonObject == undefined) {
            return undefined;
        }
        var accountRef = new AccountRef();
        accountRef.id = jsonObject.id;
        accountRef.link = jsonObject.link;
        return accountRef;
    }

    static getAccountFromJSON(jsonObject: any) : Account {
        if (jsonObject == undefined) {
            return undefined;
        }
        var account = new Account();
        account.id = jsonObject.id;
        account.company = CompanyFactory.getCompanyRefFromJSON(jsonObject.company);
        account.accountingNumber = jsonObject.accountingNumber;
        account.iban = jsonObject.iban;
        account.bic = jsonObject.bic;
        account.name = jsonObject.name;
        var descriptionTexts = LocaleTextFactory.getLocaleTextArrayFromJSON(jsonObject.description);
        account.description = LocaleTextsFactory.getLocaleTextsFromTextArray(descriptionTexts);
        account.accountType = AccountFactory.getAccountTypeFromString(jsonObject.type);
        return account;
    }

    static getAccountsArrayFromJson(jsonArray: any) : Account[] {
        if (jsonArray == undefined) {
            return undefined;
        }
        if (!(jsonArray instanceof Array)) {
            console.error('The data is not an array:');
            console.error(jsonArray);
            return undefined;
        }
        var accountsArray: Account[] = [];
        jsonArray.forEach(function(jsonObject) {
            var account = AccountFactory.getAccountFromJSON(jsonObject);
            accountsArray.push(account);
        })
        return accountsArray;
    }
}