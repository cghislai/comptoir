/**
 * Created by cghislai on 07/08/15.
 */

import {Item} from 'client/domain/item';
import {ItemPicture} from 'client/domain/itemPicture';

export class PicturedItem {
    item:Item;
    picture: ItemPicture;
    dataURI:string;
}

export class PicturedItemFactory {
    static buildPictureData(item:Item, picture:ItemPicture):PicturedItem {
        var picturedItem = new PicturedItem();
        picturedItem.item = item;
        picturedItem.picture = picture;
        picturedItem.dataURI = PicturedItemFactory.buildPictureURI(picture);
        return picturedItem;
    }

    static buildPictureURI(picture: ItemPicture):string {
        if (picture == undefined) {
            return undefined;
        }
        if (picture.contentType != undefined && picture.data != undefined
            && picture.data.length > 0) {
            var encoded = btoa(picture.data);
            var uri = "data:" + picture.contentType;
            uri += ";base64," + encoded;
            return uri;
        }
        return undefined;
    }

    static buildPictureDataFromDataURI(dataURI: string, picture: ItemPicture) {
        if (picture == undefined) {
            return;
        }
        var contentTypeStartIndex = 5; // 'data:' ...
        var contentTypeEndIndex = dataURI.indexOf(';');
        var dataStartIndex = contentTypeEndIndex + 8; // ';base64,' ...
        var dataEndIndex = dataURI.length;

        var contentType = dataURI.substring(contentTypeStartIndex, contentTypeEndIndex);
        var encodedData = dataURI.substring(dataStartIndex, dataEndIndex);
        var data = atob(encodedData);
        picture.contentType = contentType;
        picture.data = data;
    }
}