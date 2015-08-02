/**
 * Created by cghislai on 02/08/15.
 */

import {Injectable} from 'angular2/angular2';

export class Picture {
    id:number;
    contentType:string;
    dataUrl:string;
    imageUrl:string;
}

export class PictureService {

    constructor() {

    }

    getPicture(id:number):Picture {
        var picture = new Picture();
        picture.id = id;
        picture.imageUrl = this.getPictureUrl(id);
        return picture;
    }

    getPictureUrl(id:number):string {
        return null;
    }

    savePicture(picture:Picture):Picture {
        return picture;
    }
}