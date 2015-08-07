/**
 * Created by cghislai on 04/08/15.
 */

import {Company, CompanyRef, CompanyFactory} from 'client/domain/company';
import {ComptoirrRequest} from 'client/utils/request';
import {SearchResult} from 'client/utils/searchResult';

export class CompanyClient {

    private static serviceUrl:string = "http://somewhere.com/company";

    private getCompanyUrl(id?:number) {
        var url = CompanyClient.serviceUrl;
        if (id != undefined) {
            url += "/" + id;
        }
        return url;
    }

    createCompany(company:Company, authToken: string):Promise<CompanyRef> {
        var companyJSON = JSON.stringify(company);
        var request = new ComptoirrRequest();
        var url = this.getCompanyUrl();
        return request
            .post(companyJSON, url, authToken)
            .then(function (response) {
                var companyRef = CompanyFactory.getCompanyRefFromJSON(response.json);
                return companyRef;
            });
    }

    updateCompany(company:Company, authToken: string):Promise<CompanyRef> {
        var companyJSON = JSON.stringify(company);
        var request = new ComptoirrRequest();
        var url = this.getCompanyUrl(company.id);

        return request
            .put(companyJSON, url, authToken)
            .then(function (response) {
                var companyRef = CompanyFactory.getCompanyRefFromJSON(response.json);
                return companyRef;
            });
    }

    getCompany(id:number, authToken: string):Promise<Company> {
        var request = new ComptoirrRequest();
        var url = this.getCompanyUrl(id);

        return request
            .get(url, authToken)
            .then(function (response) {
                var company = CompanyFactory.getCompanyFromJSON(response.json);
                return company;
            });
    }

}