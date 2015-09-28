/**
 * Created by cghislai on 02/09/15.
 */

import {Account, AccountType, AccountFactory} from 'client/domain/account';
import {Company, CompanyRef, CompanyFactory, CompanyClient} from 'client/domain/company';

import {LocalCompany, LocalCompanyFactory} from 'client/localDomain/company';

import {LocaleTexts, LocaleTextsFactory} from 'client/utils/lang';

import {Map} from 'immutable';

export interface LocalAccount extends Map<string, any> {
    id:number;
    company:LocalCompany;
    accountingNumber:string;
    iban:string;
    bic:string;
    name:string;
    description:LocaleTexts;
    accountType:AccountType;
    accountTypeLabel:LocaleTexts;
}

export class LocalAccountFactory {

    static companyClient = new CompanyClient();

    static ACCOUNT_TYPE_OTHER_LABEL = LocaleTextsFactory.toLocaleTexts({
        'fr': 'Autre'
    });
    static ACCOUNT_TYPE_VAT_LABEL =LocaleTextsFactory.toLocaleTexts({
        'fr': 'TVA'
    });
    static ACCOUNT_TYPE_PAIMENT_LABEL = LocaleTextsFactory.toLocaleTexts({
        'fr': 'Paiment'
    });

    static getAccountTypeLabel(accountType:AccountType): LocaleTexts {
        switch (accountType) {
            case AccountType.OTHER:
            {
                return LocalAccountFactory.ACCOUNT_TYPE_OTHER_LABEL;
            }
            case AccountType.PAYMENT:
            {
                return LocalAccountFactory.ACCOUNT_TYPE_PAIMENT_LABEL;
            }
            case AccountType.VAT:
            {
                return LocalAccountFactory.ACCOUNT_TYPE_VAT_LABEL;
            }
        }
        return null;
    }

    static toLocalAccount(account:Account, authToken:string):Promise<LocalAccount> {
        var localAccountDesc: any = {};
        localAccountDesc.accountingNumber = account.accountingNumber;
        localAccountDesc.accountType = AccountType[account.accountType];
        localAccountDesc.accountTypeLabel = LocalAccountFactory.getAccountTypeLabel(localAccountDesc.accountType);
        localAccountDesc.bic = account.bic;
        localAccountDesc.description = account.description;
        localAccountDesc.iban = account.iban;
        localAccountDesc.id = account.id;
        localAccountDesc.name = account.name;

        var taskList = [];

        var companyRef = account.companyRef;
        var companyId = companyRef.id;
        taskList.push(
            LocalAccountFactory.companyClient.getFromCacheOrServer(companyId, authToken)
                .then((company)=> {
                    return LocalCompanyFactory.toLocalCompany(company, authToken);
                }).then((localCompany: LocalCompany)=>{
                    localAccountDesc.company = localCompany;
                })
        );
        return Promise.all(taskList)
            .then(()=> {
                var localAccount: LocalAccount = <LocalAccount>Map(localAccountDesc);
                return localAccount;
            });
    }

    static fromLocalAccount(localAccount:LocalAccount) {
        var account = new Account();
        account.accountingNumber = localAccount.accountingNumber;
        account.accountType = AccountType[localAccount.accountType];
        account.bic = localAccount.bic;
        account.companyRef = new CompanyRef(localAccount.company.id);
        account.description = localAccount.description;
        account.iban = localAccount.iban;
        account.id = localAccount.id;
        account.name = localAccount.name;
        return account;
    }
}