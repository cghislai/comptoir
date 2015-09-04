/**
 * Created by cghislai on 01/09/15.
 */

import {CompanyRef} from 'client/domain/company';
import {Picture} from 'client/domain/picture';

export class LocalPicture {
    id: number;
    companyRef: CompanyRef;
    data:string;
    contentType:string;
    dataURI: string;
}

export class LocalPictureFactory {
    static toLocalPicture(picture: Picture):LocalPicture {
        var localPicture = new LocalPicture();
        localPicture.id = picture.id;
        localPicture.companyRef = picture.companyRef;
        localPicture.data = picture.data;
        localPicture.contentType = picture.contentType;
        localPicture.dataURI = LocalPictureFactory.toDataURI(picture);
        return localPicture;
    }

    static fromLocalPicture(localPicture: LocalPicture):Picture {
       var picture = new Picture();
        picture.id = localPicture.id;
        picture.companyRef = localPicture.companyRef;
        picture.data = localPicture.data;
        picture.contentType = localPicture.contentType;
        if (localPicture.dataURI != null) {
            LocalPictureFactory.fromDataURI(localPicture.dataURI, picture);
        }
        return picture;
    }

    static toDataURI(picture:Picture):string {
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

    static fromDataURI(dataURI:string, picture:Picture) {
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