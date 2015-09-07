/**
 * Created by cghislai on 02/09/15.
 */

import {CompanyRef} from 'client/domain/company';
import {ItemRef} from 'client/domain/item';
import {ItemVariantRef} from 'client/domain/itemVariant';

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


}