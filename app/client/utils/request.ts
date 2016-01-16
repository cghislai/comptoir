/**
 * Created by cghislai on 04/08/15.
 */
import {JSONFactory} from './factory';

export class ComptoirResponse {
    text:string;
    code:number;
    listTotalCountHeader:string;
}

export class ComptoirError {
    static DISCARDED_ERROR = new ComptoirError("Request discarded");

    text:string;
    code:number;
    response:string;
    request:ComptoirRequest;

    constructor(message?:string) {
        if (message != null) {
            this.text = message;
        }
    }
}

export class ComptoirRequest {

    static REQUEST_TIMEOUT:number = 60000;
    static JSON_MIME:string = "application/json";
    static UTF8_CHARSET:string = "UTF-8";
    static HEADER_OAUTH_TOKEN = "Authorization";
    static HEADER_TOTAL_COUNT = 'X-Comptoir-ListTotalCount';

    private request:XMLHttpRequest;
    private method:string;
    private url:string;
    private authToken:string;
    private objectToSend:any;
    private contentType:string;
    private acceptContentType:string;
    private charset:string;
    private failed:boolean;
    private discarded:boolean;

    running:boolean;
    promiseTask:Promise<ComptoirResponse>;

    constructor() {
        this.request = new XMLHttpRequest();
        this.acceptContentType = ComptoirRequest.JSON_MIME + ',' + 'text/*';
        this.charset = ComptoirRequest.UTF8_CHARSET;
        this.contentType = ComptoirRequest.JSON_MIME;
    }

    get(url:string, authToken?:string):Promise<any> {
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
        if (this.request) {
            this.request.abort();
        }
    }

    setup(method:string, url:string, authToken:string) {
        this.method = method;
        this.url = url;
        this.authToken = authToken;
    }

    setupData(obj:any) {
        this.objectToSend = obj;
    }

    getDebugString() {
        var string = this.method + " " + this.url + " ";
        return string;
    }

    run():Promise<ComptoirResponse> {
        var promiseTask = (resolve, reject)=> {
            this.running = true;
            this.request.onreadystatechange = ()=> {
                if (this.discarded) {
                    reject(ComptoirError.DISCARDED_ERROR);
                    return;
                }
                if (this.request.readyState !== 4) {
                    return;
                }
                if (this.request.status !== 200 && this.request.status !== 204) {
                    var error = new ComptoirError();
                    error.code = this.request.status;
                    error.text = this.request.statusText;
                    error.request = this;
                    if (this.request.response != null) {
                        error.response = this.request.response.text;
                    }
                    reject(error);
                    return;
                }
                var response = new ComptoirResponse();
                response.code = this.request.status;
                response.listTotalCountHeader = this.request.getResponseHeader(ComptoirRequest.HEADER_TOTAL_COUNT);
                response.text = this.request.responseText;
                resolve(response);
            };
            this.request.onerror = ()=> {
                if (this.discarded) {
                    reject(ComptoirError.DISCARDED_ERROR);
                    return;
                }
                var error = new ComptoirError();
                error.code = this.request.status;
                error.text = this.request.statusText;
                error.request = this;
                if (this.request.response != null) {
                    error.response = this.request.response.text;
                }
                reject(error);
                return;
            };
            this.request.timeout = ComptoirRequest.REQUEST_TIMEOUT;
            this.request.open(this.method, this.url, true);
            this.request.setRequestHeader('Accept', this.acceptContentType);
            this.request.setRequestHeader('Content-Type', this.contentType + '; charset=' + this.charset);
            if (this.authToken != null) {
                this.request.setRequestHeader(ComptoirRequest.HEADER_OAUTH_TOKEN, 'Bearer ' + this.authToken);
            }

            if (this.objectToSend != null) {
                var stringifiedJSON = JSON.stringify(this.objectToSend, JSONFactory.toJSONReplacer);
                this.request.send(stringifiedJSON);
            } else {
                this.request.send();
            }
        };
        this.promiseTask = new Promise(promiseTask);
        return this.promiseTask
            .then((response)=> {
                this.running = false;
                return response;
            })
            .catch((error)=> {
                this.running = false;
                throw error;
            });
    }


}