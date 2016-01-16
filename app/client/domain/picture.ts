/**
 * Created by cghislai on 02/09/15.
 */

import {CompanyRef} from './company';
import {ItemRef} from './item';
import {ItemVariantRef} from './itemVariant';


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
    static fromJSONReviver = (key, value)=> {
        return value;
    }


}