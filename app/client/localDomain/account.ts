/**
 * Created by cghislai on 02/09/15.
 */

import {Account, AccountType, AccountFactory} from 'client/domain/account';
import {Company, CompanyRef, CompanyFactory, CompanyClient} from 'client/domain/company';
import {LocalCompany, LocalCompanyFactory} from 'client/localDomain/company';
import {LocaleTexts, LocaleTextsFactory} from 'client/utils/lang';

export class LocalAccount {
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

    static ACCOUNT_TYPE_OTHER_LABEL = {
        'fr': 'Autre'
    };
    static ACCOUNT_TYPE_VAT_LABEL = {
        'fr': 'TVA'
    };
    static ACCOUNT_TYPE_PAIMENT_LABEL = {
        'fr': 'Paiment'
    };

    static getAccountTypeLabel(accountType:AccountType) {
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
        var localAccount = new LocalAccount();
        return LocalAccountFactory.updateLocalAccount(localAccount, account, authToken);
    }

    static updateLocalAccount(localAccount:LocalAccount, account:Account, authToken:string):Promise<LocalAccount> {

        localAccount.accountingNumber = account.accountingNumber;
        localAccount.accountType = AccountType[account.accountType];
        localAccount.accountTypeLabel = LocalAccountFactory.getAccountTypeLabel(localAccount.accountType);
        localAccount.bic = account.bic;
        localAccount.description = account.description;
        localAccount.iban = account.iban;
        localAccount.id = account.id;
        localAccount.name = account.name;

        var taskList = [];

        var companyRef = account.companyRef;
        var companyId = companyRef.id;
        taskList.push(
            LocalAccountFactory.companyClient.getFromCacheOrServer(companyId, authToken)
                .then((company)=> {
                    return LocalCompanyFactory.toLocalCompany(company, authToken);
                }).then((localCompany: LocalCompany)=>{
                    localAccount.company = localCompany;
                })
        );
        return Promise.all(taskList)
            .then(()=> {
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