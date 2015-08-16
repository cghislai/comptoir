/**
 * Created by cghislai on 16/08/15.
 */

import {AccountRef, AccountSearch} from 'client/domain/account';
import {CompanyRef} from 'client/domain/company';

export class Balance {
    id:number;
    accountRef:AccountRef;
    dateTime: Date;
    balance: number;
    comment: string;
    closed: boolean;
}

export class BalanceRef {
    id: number;
    link: string;

    constructor(id?: number) {
        this.id = id;
    }
}

export class BalanceSearch {
    companyRef: CompanyRef;
    accountSearch: AccountSearch;
    fromDateTime: Date;
    toDateTime : Date;
}

export class BalanceFactory {
    static fromJSONBalanceReviver=(key,value)=>{
        if (key == 'dateTime') {
            var date = new Date(value);
            return date;
        }
    };
    static fromJSONBalanceSearchReviver=(key,value)=>{
        if (key == 'fromDateTime' || key == 'toDateTime') {
            var date = new Date(value);
            return date;
        }
    };
}