/**
 * Created by cghislai on 07/08/15.
 */

import {ItemRef, ItemFactory} from 'client/domain/item';

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

export class ItemPictureSearch {

}

export class ItemPictureFactory {
    static buildItemPictureRefFromJSON(jsonObject:any):ItemPictureRef {
        if (jsonObject == undefined) {
            return undefined;
        }
        var pictureRef = new ItemPictureRef();
        pictureRef.id = jsonObject.id;
        pictureRef.link = jsonObject.link;
        return pictureRef;
    }

    static buildItemPictureFromJSON(jsonObject:any):ItemPicture {
        if (jsonObject == undefined) {
            return undefined;
        }
        var picture = new ItemPicture();
        picture.contentType = jsonObject.contentType;
        picture.data = jsonObject.data;
        picture.id = jsonObject.id;
        picture.itemRef = ItemFactory.buildItemRefFromJSON(jsonObject.itemRef);
        return picture;
    }
}