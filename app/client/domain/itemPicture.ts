/**
 * Created by cghislai on 07/08/15.
 */

import {ItemVariantRef} from 'client/domain/itemVariant';

export class ItemPictureRef {
    id:number;
    link:string;
    constructor(id?: number) {
        this.id = id;
    }
}

export class ItemPicture {
    id:number;
    data:string;
    contentType:string;
}

export class ItemPictureSearch {

}

export class ItemPictureFactory {
    static fromJSONPictureReviver = (key, value)=> {
        return value;
    }



}