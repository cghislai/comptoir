/**
 * Created by cghislai on 04/08/15.
 */

import {Company, CompanyRef, CompanyFactory} from 'client/domain/company';
import {ComptoirRequest} from 'client/utils/request';
import {SearchResult} from 'client/utils/search';
import {ServiceConfig} from 'client/utils/service';

export class CompanyClient {

    private static RESOURCE_PATH="/company";

    private getCompanyUrl(id?:number) {
        var url = ServiceConfig.URL + CompanyClient.RESOURCE_PATH;
        if (id != undefined) {
            url += "/" + id;
        }
        return url;
    }
    private getSearchUrl() {
        var url = ServiceConfig.URL + CompanyClient.RESOURCE_PATH;
        url += '/search';
        return url;
    }

    createCompany(company:Company, authToken: string):Promise<CompanyRef> {
        var request = new ComptoirRequest();
        var url = this.getCompanyUrl();
        return request
            .post(company, url, authToken)
            .then(function (response) {
                var companyRef = JSON.parse(response.text);
                return companyRef;
            });
    }

    updateCompany(company:Company, authToken: string):Promise<CompanyRef> {
        var request = new ComptoirRequest();
        var url = this.getCompanyUrl(company.id);

        return request
            .put(company, url, authToken)
            .then(function (response) {
                var companyRef = JSON.parse(response.text);
                return companyRef;
            });
    }

    getCompany(id:number, authToken: string):Promise<Company> {
        var request = new ComptoirRequest();
        var url = this.getCompanyUrl(id);

        return request
            .get(url, authToken)
            .then(function (response) {
                var company = JSON.parse(response.text, CompanyFactory.fromJSONCompanyReviver);
                return company;
            });
    }


    uploadImportDataFile(data:any, companyRef: CompanyRef, authToken: string,
                         progressCallback?:(precentage:number)=>any): Promise<any> {
        var request = new XMLHttpRequest();
        var url = this.getCompanyUrl(companyRef.id)+"/import";


        var self = this;
        if (progressCallback != null) {
            request.upload.addEventListener("progress", function (e: ProgressEvent) {
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

            request.onreadystatechange = function () {
                if (request.readyState != 4) {
                    return;
                }
                if (request.status != 200 && request.status != 204) {
                    reject(new Error('XMLHttpRequest Error: ' + request.status+" : " + request.statusText));
                    return;
                }
                resolve(request.status);
            }
            request.onerror = function () {
                reject(new Error('XMLHttpRequest Error: ' + request.statusText));
            };

            request.setRequestHeader('Content-Type', 'multipart/form-data; charset=UTF-8');
            if (authToken != null) {
                request.setRequestHeader(ComptoirRequest.HEADER_OAUTH_TOKEN, 'Bearer '+authToken);
            }
            request.send(data);
        });
    }

}