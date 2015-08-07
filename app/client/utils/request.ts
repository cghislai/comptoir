/**
 * Created by cghislai on 04/08/15.
 */

import {ApplicationService} from 'services/application';

export class PromiseRequest {

    static JSON_MIME:string = "application/json";
    static UTF8_CHARSET:string = "UTF-8";

    request:XMLHttpRequest;
    method:string;
    url:string;
    objectToSend:any;
    contentType:string;
    acceptContentType:string;
    charset:string;
    failed:boolean;

    constructor() {
        this.request = new XMLHttpRequest();
        this.acceptContentType = PromiseRequest.JSON_MIME;
        this.charset = PromiseRequest.UTF8_CHARSET;
        this.contentType = PromiseRequest.JSON_MIME;
    }

    get(url:string):Promise<any> {
        this.setup('GET', url);
        return this.run();
    }

    put(jsonObject:any, url:string):Promise<any> {
        this.setup('PUT', url);
        this.setupData(jsonObject);
        return this.run();
    }

    post(jsoObject:any, url:string):Promise<any> {
        this.setup('POST', url);
        this.setupData(jsoObject);
        return this.run();
    }

    private setup(method:string, url:string) {
        this.method = method;
        this.url = url;
    }

    private setupData(obj:any) {
        this.objectToSend = obj;
    }

    run():Promise<any> {
        var xmlRequest = this.request;
        var thisRequest = this;
        return new Promise((resolve, reject)=> {
            xmlRequest.onreadystatechange = function () {
                if (xmlRequest.readyState != 4) {
                    return;
                }
                if (xmlRequest.status != 200) {
                    reject(new Error('XMLHttpRequest Error: ' + xmlRequest.statusText));
                    return;
                }
                resolve(xmlRequest.responseXML);
            }
            xmlRequest.onerror = function () {
                reject(new Error('XMLHttpRequest Error: ' + xmlRequest.statusText));
            };
            xmlRequest.open(thisRequest.method, thisRequest.url);
            xmlRequest.setRequestHeader('Content-Type', thisRequest.contentType + '; charset=' + thisRequest.charset);
            xmlRequest.setRequestHeader('Accept', thisRequest.acceptContentType);
            xmlRequest.send(thisRequest.objectToSend);
        });
    }


}