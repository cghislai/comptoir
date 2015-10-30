/**
 * Created by cghislai on 14/08/15.
 */

import {CompanyRef} from 'client/domain/company';
import {CustomerRef} from 'client/domain/customer';
import {LocaleTexts,LocaleTextsFactory} from 'client/utils/lang';
import {BasicClient,BasicCacheHandler, BasicClientResourceInfo} from 'client/utils/basicClient';


export class PosClient extends BasicClient<Pos> {

    private static RESOURCE_PATH:string = "/pos";

    constructor() {
        super(<BasicClientResourceInfo<Pos>>{
            resourcePath: PosClient.RESOURCE_PATH,
            jsonReviver: PosFactory.fromJSONPosReviver,
            cacheHandler: PosFactory.cacheHandler
        });
    }
}
export class Pos {
    id:number;
    companyRef:CompanyRef;
    name:string;
    description:LocaleTexts;
    defaultCustomerRef:CustomerRef;
}

export class PosRef {
    id:number;
    link:string;

    constructor(id?:number) {
        this.id = id;
    }
}

export class PosSearch {
    companyRef:CompanyRef;
}

export class PosFactory {
    static cacheHandler = new BasicCacheHandler<Pos>();
    static fromJSONPosReviver = (key, value)=> {
        if (key == 'description') {
            return LocaleTextsFactory.fromLocaleTextArrayReviver(value);
        }
        return value;
    }

}