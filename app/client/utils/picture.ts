/**
 * Created by cghislai on 07/08/15.
 */

import {Item} from 'client/domain/item';
import {ItemPicture} from 'client/domain/itemPicture';

export class PicturedItem {
    item:Item;
    picture:ItemPicture;
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

    static buildPictureURI(picture:ItemPicture):string {
        if (picture == undefined) {
            return undefined;
        }
        if (picture.contentType != undefined && picture.data != undefined
            && picture.data.length > 0) {
            var uri = "data:" + picture.contentType;
            uri += ";base64," + picture.data;
            return uri;
        }
        return undefined;
    }

    static buildPictureDataFromDataURI(dataURI:string, picture:ItemPicture) {
        if (picture == undefined) {
            return;
        }
        var contentTypeStartIndex = 5; // 'data:' ...
        var contentTypeEndIndex = dataURI.indexOf(';');
        var dataStartIndex = contentTypeEndIndex + 8; // ';base64,' ...
        var dataEndIndex = dataURI.length;

        var contentType = dataURI.substring(contentTypeStartIndex, contentTypeEndIndex);
        var encodedData = dataURI.substring(dataStartIndex, dataEndIndex);
        picture.contentType = contentType;
        picture.data = encodedData;
    }

    static getPictureDataFromString(datastring:string) {
        var buf = new ArrayBuffer(datastring.length * 2); // 2 bytes for each char
        var bufView = new Uint16Array(buf);
        for (var i = 0; i < datastring.length; i++) {
            bufView[i] = datastring.charCodeAt(i);
        }
        var data:number[] = Array.prototype.slice.call(bufView);
        return data;
    }
}