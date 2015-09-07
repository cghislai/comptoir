/**
 * Created by cghislai on 16/08/15.
 */

import {AccountRef, AccountSearch} from 'client/domain/account';
import {CompanyRef} from 'client/domain/company';
import {BasicClient, BasicClientResourceInfo} from 'client/utils/basicClient';
import {ComptoirRequest} from 'client/utils/request';


export class BalanceClient extends BasicClient<Balance> {

    private static RESOURCE_PATH:string = "/balance";
    constructor() {
        super({
            resourcePath: BalanceClient.RESOURCE_PATH,
            jsonReviver: BalanceFactory.fromJSONBalanceReviver
        });
    }
    closeBalance(id: number, authToken: string) : Promise<BalanceRef> {
        var request = new ComptoirRequest();
        var url = this.getResourceUrl(id);
        url += "/state/CLOSED";

        return request
            .put(null, url, authToken)
            .then(function (response) {
                var balanceRef = JSON.parse(response.text);
                return balanceRef;
            });
    }
}
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
        return value;
    };
    static fromJSONBalanceSearchReviver=(key,value)=>{
        if (key == 'fromDateTime' || key == 'toDateTime') {
            var date = new Date(value);
            return date;
        }
        return value;
    };
}