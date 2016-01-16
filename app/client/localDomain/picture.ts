/**
 * Created by cghislai on 01/09/15.
 */


import {Picture} from '../domain/picture';
import {LocalCompany} from './company';

import * as Immutable from 'immutable';

export interface LocalPicture extends Immutable.Map<string, any> {
    id:number;
    company:LocalCompany;
    data:string;
    contentType:string;
    dataURI:string;
}
var PictureRecord = Immutable.Record({
    id: null,
    company: null,
    data: null,
    contentType: null,
    dataURI: null
});

export class LocalPictureFactory {

    static createNewPicture(desc:any):LocalPicture {
        return <any>PictureRecord(desc);
    }

    static toDataURI(picture:Picture):string {
        if (picture === undefined) {
            return undefined;
        }
        if (picture.contentType !== undefined && picture.data !== undefined
            && picture.data.length > 0) {
            var uri = "data:" + picture.contentType;
            uri += ";base64," + picture.data;
            return uri;
        }
        return undefined;
    }

    static fromDataURI(dataURI:string, picture:Picture) {
        if (picture === undefined) {
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

    static dataFromString(datastring:string) {
        var buf = new ArrayBuffer(datastring.length * 2); // 2 bytes for each char
        var bufView = new Uint16Array(buf);
        for (var i = 0; i < datastring.length; i++) {
            bufView[i] = datastring.charCodeAt(i);
        }
        var data:number[] = Array.prototype.slice.call(bufView);
        return data;
    }
}