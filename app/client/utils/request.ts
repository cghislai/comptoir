/**
 * Created by cghislai on 04/08/15.
 */

export class PromiseRequest {

    request: XMLHttpRequest;
    method: string;
    url; string;
    objectToSend: any;

    constructor() {
        this.request = new XMLHttpRequest();
    }
    setup(method: string, url: string) {
        this.method = method;
        this.url = url;
    }

    send(obj: any) {
        this.objectToSend = obj;
    }

    run(): Promise<any> {
        var request = this.request;
        var thisRequest = this;
        return new Promise((resolve, reject)=>{
            request.onreadystatechange = function() {
                if (request.readyState != 4) {
                    return;
                }
                if (request.status != 200) {
                    reject(new Error('XMLHttpRequest Error: '+request.statusText));
                    return;
                }
                resolve(request.responseXML);
            }
            request.onerror = function () {
                reject(new Error('XMLHttpRequest Error: '+request.statusText));
            };
            request.open(thisRequest.method, thisRequest.url);
            request.send(thisRequest.objectToSend);
        });
    }
}