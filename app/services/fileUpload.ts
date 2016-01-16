/**
 * Created by cghislai on 14/08/15.
 */
import {Inject, Injectable,Injector} from 'angular2/core';

@Injectable()
export class FileUploadService {

    request:XMLHttpRequest;

    uploadFile(data:any, url:string, progressCallback?:(precentage:number)=>any): Promise<any> {
        var request = new XMLHttpRequest();
        this.request = request;

        var self = this;
        if (progressCallback != null) {
            this.request.upload.addEventListener("progress", function (e: ProgressEvent) {
                if (e.lengthComputable) {
                    var percentage = Math.round((e.loaded * 100) / e.total);
                    progressCallback(percentage);
                }
            }, false);
        }

        return new Promise<any>((resolve, reject)=>{
            request.upload.addEventListener("load", function (e) {
              resolve(e);
            }, false);
            request.open("POST",url);
            request.setRequestHeader('Content-Type', 'multipart/form-data; charset=UTF-8');
            request.send(data);
        });
    }
}