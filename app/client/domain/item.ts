/**
 * Created by cghislai on 01/09/15.
 */


import {CompanyRef} from 'client/domain/company';
import {PictureRef} from 'client/domain/picture';
import {LocaleTexts, LocaleTextsFactory} from 'client/utils/lang';
import {BasicClient, BasicCacheHandler, BasicClientResourceInfo} from 'client/utils/basicClient';


export class ItemClient extends BasicClient<Item> {

    private static RESOURCE_PATH:string = "/item";
    constructor() {
        super({
            resourcePath: ItemClient.RESOURCE_PATH,
            jsonReviver: ItemFactory.fromJSONItemReviver,
            cacheHandler: ItemFactory.cacheHandler
        });
    }
}

export class ItemRef {
    id: number;
    link: string;

    constructor(id?: number) {
        this.id = id;
    }
}

export class Item {
    id: number;
    companyRef:CompanyRef;
    reference: string;
    name:LocaleTexts;
    description:LocaleTexts;

    vatExclusive:number;
    vatRate:number;

    mainPictureRef:PictureRef;
}

export class ItemSearch {
    companyRef: CompanyRef;
    multiSearch:string;
    nameContains:string;
    descriptionContains:string;
    reference:string;
    referenceContains:string;
}

export class ItemFactory {
    static cacheHandler = new BasicCacheHandler<Item>();
    static fromJSONItemReviver = (key, value)=> {
        if (key == 'name' || key == "description") {
            return LocaleTextsFactory.fromLocaleTextArrayReviver(value);
        }
        return value;
    }
}