/**
 * Created by cghislai on 04/08/15.
 */

import {LocaleTexts, LocaleTextsFactory} from 'client/utils/lang';
import {CountryRef} from 'client/domain/country';
import {ComptoirRequest} from 'client/utils/request';
import {BasicClient} from 'client/utils/basicClient';

export class CompanyClient extends BasicClient<Company> {

    private static RESOURCE_PATH:string = "/company";
    constructor() {
        super({
            resourcePath: CompanyClient.RESOURCE_PATH,
            jsonReviver: CompanyFactory.fromJSONCompanyReviver,
            cache: CompanyFactory.cache
        });
    }
    uploadImportDataFile(data:any, companyRef: CompanyRef, authToken: string,
                         progressCallback?:(precentage:number)=>any): Promise<any> {
        var request = new XMLHttpRequest();
        var url = this.getResourceUrl(companyRef.id)+"/import";


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

export class Company {
    id: number;
    name: LocaleTexts;
    description: LocaleTexts;
    countryRef: CountryRef;
}

export class CompanyRef {
    link: string;
    id: number;
    constructor(id?: number) {
        this.id = id;
    }
}

export class CompanyFactory {
    static fromJSONCompanyReviver=(key,value)=>{
      if (key == 'name' || key == "description") {
          return LocaleTextsFactory.fromLocaleTextArrayReviver(value);
      }
        return value;
    };

    static cache: {[id: number] : Company} = {};
    static putInCache(company: Company) {
        var companyId = company.id;
        if (companyId == null) {
            throw 'no id';
        }
        CompanyFactory.cache[companyId] = company;
    }

    static getFromCache(id: number) {
        return CompanyFactory.cache[id];
    }

    static clearFromCache(id: number) {
        delete CompanyFactory.cache[id];
    }

    static clearCache() {
        CompanyFactory.cache = {};
    }
}