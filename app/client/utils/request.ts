/**
 * Created by cghislai on 04/08/15.
 */
import {JSONFactory} from 'client/utils/factory';

export class ComptoirResponse {
    headers: any;
    text: string;
    code: number;
}

export class ComptoirrRequest {

    static JSON_MIME:string = "application/json";
    static UTF8_CHARSET:string = "UTF-8";
    static HEADER_OAUTH_TOKEN= "Authorisation";

    request:XMLHttpRequest;
    method:string;
    url:string;
    authToken: string;
    objectToSend:any;
    contentType:string;
    acceptContentType:string;
    charset:string;
    failed:boolean;

    constructor() {
        this.request = new XMLHttpRequest();
        this.acceptContentType = ComptoirrRequest.JSON_MIME+','+'text/*';
        this.charset = ComptoirrRequest.UTF8_CHARSET;
        this.contentType = ComptoirrRequest.JSON_MIME;
    }

    get(url:string, authToken: string):Promise<any> {
        this.setup('GET', url, authToken);
        return this.run();
    }

    put(jsonObject:any, url:string, authToken: string):Promise<ComptoirResponse> {
        this.setup('PUT', url, authToken);
        this.setupData(jsonObject);
        return this.run();
    }

    post(jsoObject:any, url:string, authToken: string):Promise<ComptoirResponse> {
        this.setup('POST', url, authToken);
        this.setupData(jsoObject);
        return this.run();
    }

    private setup(method:string, url:string, authToken: string) {
        this.method = method;
        this.url = url;
        this.authToken = authToken;
    }

    private setupData(obj:any) {
        this.objectToSend = obj;
    }

    run():Promise<ComptoirResponse> {
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
                var response = new ComptoirResponse();
                response.code = xmlRequest.status;
                response.headers = xmlRequest.getAllResponseHeaders();
                response.text = xmlRequest.responseText;
                resolve(response);
            }
            xmlRequest.onerror = function () {
                reject(new Error('XMLHttpRequest Error: ' + xmlRequest.statusText));
            };
            xmlRequest.open(thisRequest.method, thisRequest.url);
            xmlRequest.setRequestHeader('Accept', thisRequest.acceptContentType);
            xmlRequest.setRequestHeader('Content-Type', thisRequest.contentType + '; charset=' + thisRequest.charset);
            if (this.authToken != null) {
                xmlRequest.setRequestHeader(ComptoirrRequest.HEADER_OAUTH_TOKEN, 'Bearer '+this.authToken);
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