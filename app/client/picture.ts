/**
 * Created by cghislai on 06/08/15.
 */


import {Picture, PictureRef, PictureSearch, PictureFactory} from 'client/domain/picture';
import {Pagination} from 'client/utils/pagination';
import {ComptoirRequest} from 'client/utils/request';
import {SearchResult} from 'client/utils/search';
import {ServiceConfig} from 'client/utils/service';


export class PictureClient {

    private static RESOURCE_PATH:string = "/picture";

    private getResourceUrl():string {
        return ServiceConfig.URL + PictureClient.RESOURCE_PATH;
    }

    private getPictureUrl(id?:number) {
        var url = ServiceConfig.URL + PictureClient.RESOURCE_PATH;
        if (id != undefined) {
            url += "/" + id;
        }
        return url;
    }

    private getSearchUrl(pagination:Pagination) {
        var url = ServiceConfig.URL + PictureClient.RESOURCE_PATH;
        url += '/search';
        if (pagination != null) {
            url += '?offset=';
            url += pagination.firstIndex;
            url += "&length=";
            url += pagination.pageSize;
        }
        return url;
    }


    createPicture(picture:Picture, authToken:string):Promise<PictureRef> {
        var url = this.getResourceUrl();
        var request = new ComptoirRequest();
        return request.post(picture, url, authToken)
            .then(function (response) {
                var pictureRef = JSON.parse(response.text);
                return pictureRef;
            });
    }

    getCreatePictureRequest(picture:Picture, authToken:string):ComptoirRequest {
        var url = this.getResourceUrl();
        var request = new ComptoirRequest();
        request.setup('POST', url, authToken);
        request.setupData(picture);
        return request;
    }

    updatePicture(picture:Picture, authToken:string):Promise<PictureRef> {
        var url = this.getPictureUrl(picture.id);
        var request = new ComptoirRequest();
        return request.put(picture, url, authToken)
            .then(function (response) {
                var pictureRef = JSON.parse(response.text);
                return pictureRef;
            });
    }

    getUpdatePictureRequest(picture:Picture, authToken:string):ComptoirRequest {
        var url = this.getPictureUrl(picture.id);
        var request = new ComptoirRequest();
        request.setup('PUT', url, authToken);
        request.setupData(picture);
        return request;
    }


    getPicture(id:number, authToken:string):Promise<Picture> {
        var url = this.getPictureUrl(id);
        var request = new ComptoirRequest();
        return request.get(url, authToken)
            .then(function (response) {
                var picture = JSON.parse(response.text, PictureFactory.fromJSONPictureReviver);
                return picture;
            });
    }

    getGetPictureRequest(id:number, authToken:string):ComptoirRequest {
        var url = this.getPictureUrl(id);
        var request = new ComptoirRequest();
        request.setup('GET', url, authToken);
        return request;
    }

    searchPictures(search:PictureSearch, pagination:Pagination, authToken:string):Promise<SearchResult<Picture>> {
        var url = this.getSearchUrl(pagination);
        var request = new ComptoirRequest();
        return request.post(search, url, authToken)
            .then(function (response) {
                var result = new SearchResult<Picture>().parseResponse(response, PictureFactory.fromJSONPictureReviver);
                return result;
            });
    }


}