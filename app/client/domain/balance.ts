/**
 * Created by cghislai on 16/08/15.
 */

import {AccountRef, AccountSearch} from './account';
import {CompanyRef} from './company';
import {ComptoirRequest} from '../utils/request';

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
    accountRef: AccountRef;
    accountSearch: AccountSearch;
    fromDateTime: Date;
    toDateTime : Date;
    closed: boolean;
}

export class BalanceFactory {
    static fromJSONReviver=(key,value)=>{
        if (key ==='dateTime') {
            var date = new Date(value);
            return date;
        }
        return value;
    };

}