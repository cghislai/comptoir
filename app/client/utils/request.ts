/**
 * Created by cghislai on 04/08/15.
 */
import {JSONFactory} from 'client/utils/factory';

export class ComptoirResponse {
    text:string;
    code:number;
    listTotalCountHeader:string;
}
export class ComptoirError {
    text:string;
    code:number;
    response:string;
}

export class ComptoirRequest {

    static JSON_MIME:string = "application/json";
    static UTF8_CHARSET:string = "UTF-8";
    static HEADER_OAUTH_TOKEN = "Authorisation";
    static HEADER_TOTAL_COUNT = 'X-Comptoir-ListTotalCount';
    static DISCARDED_ERROR = new Error("Request discarded");

    private request:XMLHttpRequest;
    private method:string;
    private url:string;
    private authToken:string;
    private objectToSend:any;
    private contentType:string;
    private acceptContentType:string;
    private charset:string;
    private failed:boolean;
    private discarded: boolean;

    constructor() {
        this.request = new XMLHttpRequest();
        this.acceptContentType = ComptoirRequest.JSON_MIME + ',' + 'text/*';
        this.charset = ComptoirRequest.UTF8_CHARSET;
        this.contentType = ComptoirRequest.JSON_MIME;
    }

    get(url:string, authToken:string):Promise<any> {
        this.setup('GET', url, authToken);
        return this.run();
    }

    put(jsonObject:any, url:string, authToken:string):Promise<ComptoirResponse> {
        this.setup('PUT', url, authToken);
        this.setupData(jsonObject);
        return this.run();
    }

    post(jsoObject:any, url:string, authToken:string):Promise<ComptoirResponse> {
        this.setup('POST', url, authToken);
        this.setupData(jsoObject);
        return this.run();
    }

    delete(url:string, authToken:string):Promise<ComptoirResponse> {
        this.setup('DELETE', url, authToken);
        return this.run();
    }

    discardRequest() {
        this.discarded = true;
    }

    setup(method:string, url:string, authToken:string) {
        this.method = method;
        this.url = url;
        this.authToken = authToken;
    }

    setupData(obj:any) {
        this.objectToSend = obj;
    }

    run():Promise<ComptoirResponse> {
        var xmlRequest = this.request;
        var thisRequest = this;
        return new Promise((resolve, reject)=> {
            xmlRequest.onreadystatechange = function () {
                if (thisRequest.discarded) {
                    reject(ComptoirRequest.DISCARDED_ERROR);
                    return;
                }
                if (xmlRequest.readyState != 4) {
                    return;
                }
                if (xmlRequest.status != 200 && xmlRequest.status != 204) {
                    var error = new ComptoirError();
                    error.code = xmlRequest.status;
                    error.text = xmlRequest.statusText;
                    if (xmlRequest.response != null) {
                        error.response = xmlRequest.response.text;
                    }
                    reject(error);
                    return;
                }
                var response = new ComptoirResponse();
                response.code = xmlRequest.status;
                response.listTotalCountHeader = xmlRequest.getResponseHeader(ComptoirRequest.HEADER_TOTAL_COUNT);
                response.text = new String(xmlRequest.responseText).toString();
                resolve(response);
            }
            xmlRequest.onerror = function () {
                if (thisRequest.discarded) {
                    reject(ComptoirRequest.DISCARDED_ERROR);
                    return;
                }
                var error = new ComptoirError();
                error.code = xmlRequest.status;
                error.text = xmlRequest.statusText;
                if (xmlRequest.response != null) {
                    error.response = xmlRequest.response.text;
                }
                reject(error);
                return;
            };
            xmlRequest.open(thisRequest.method, thisRequest.url);
            xmlRequest.setRequestHeader('Accept', thisRequest.acceptContentType);
            xmlRequest.setRequestHeader('Content-Type', thisRequest.contentType + '; charset=' + thisRequest.charset);
            if (this.authToken != null) {
                xmlRequest.setRequestHeader(ComptoirRequest.HEADER_OAUTH_TOKEN, 'Bearer ' + this.authToken);
            }

            if (thisRequest.objectToSend != null) {
                var stringifiedJSON = JSON.stringify(thisRequest.objectToSend, JSONFactory.toJSONReplacer);
                xmlRequest.send(stringifiedJSON);
            } else {
                xmlRequest.send();
            }
        });
    }
}