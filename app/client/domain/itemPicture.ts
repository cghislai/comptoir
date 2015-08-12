/**
 * Created by cghislai on 07/08/15.
 */

import {ItemRef} from 'client/domain/item';

export class ItemPictureRef {
    id:number;
    link:string;
}

export class ItemPicture {
    id:number;
    itemRef:ItemRef;
    data:string;
    contentType:string;
}

export class ItemPictureSearch{

}

export class ItemPictureFactory {
    static fromJSONPictureReviver = (key, value)=> {
        return value;
    }



}