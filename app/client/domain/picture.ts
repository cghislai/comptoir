/**
 * Created by cghislai on 02/09/15.
 */

import {CompanyRef} from 'client/domain/company';
import {ItemRef} from 'client/domain/item';
import {ItemVariantRef} from 'client/domain/itemVariant';
import {BasicClient, BasicClientResourceInfo} from 'client/utils/basicClient';


export class PictureClient extends BasicClient<Picture> {

    private static RESOURCE_PATH:string = "/picture";

    constructor() {
        super({
            resourcePath: PictureClient.RESOURCE_PATH,
            jsonReviver: PictureFactory.fromJSONPictureReviver,
            cache: PictureFactory.cache
        });
    }
}

export class PictureRef {
    id:number;
    link:string;

    constructor(id?:number) {
        this.id = id;
    }
}

export class Picture {
    id:number;
    companyRef: CompanyRef;
    data:string;
    contentType:string;
}

export class PictureSearch {
    companyRef: CompanyRef;
    itemVariantRef: ItemVariantRef;
    itemRef: ItemRef;
}

export class PictureFactory {
    static fromJSONPictureReviver = (key, value)=> {
        return value;
    }

    static cache: {[id: number] : Picture} = {};
    static putInCache(picture: Picture) {
        var pictureId = picture.id;
        if (pictureId == null) {
            throw 'no id';
        }
        PictureFactory.cache[pictureId] = picture;
    }

    static getFromCache(id: number) {
        return PictureFactory.cache[id];
    }

    static clearFromCache(id: number) {
        delete PictureFactory.cache[id];
    }

    static clearCache() {
        PictureFactory.cache = {};
    }
}