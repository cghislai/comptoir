/**
 * Created by cghislai on 04/08/15.
 */

import {Company, CompanyRef, CompanyFactory} from 'client/domain/company';
import {PromiseRequest} from 'client/utils/request';

export class CompanyClient {

    private static serviceUrl:string = "http://somewhere.com/company";

    private getCompanyUrl(id?:number) {
        var url = CompanyClient.serviceUrl;
        if (id != undefined) {
            url += "/" + id;
        }
        return url;
    }

    createCompany(company:Company):Promise<CompanyRef> {
        var companyJSON = JSON.stringify(company);
        var request = new PromiseRequest();
        var url = this.getCompanyUrl();
        return request
            .post(companyJSON, url)
            .then(function (response) {
                var companyRef = CompanyFactory.getCompanyRefFromJSON(response);
                return companyRef;
            });
    }

    updateCompany(company:Company):Promise<CompanyRef> {
        var companyJSON = JSON.stringify(company);
        var request = new PromiseRequest();
        var url = this.getCompanyUrl(company.id);

        return request
            .put(companyJSON, url)
            .then(function (response) {
                var companyRef = CompanyFactory.getCompanyRefFromJSON(response);
                return companyRef;
            });
    }

    getCompany(id:number):Promise<Company> {
        var request = new PromiseRequest();
        var url = this.getCompanyUrl(id);

        return request
            .get(url)
            .then(function (response) {
                var company = CompanyFactory.getCompanyFromJSON(response);
                return company;
            });
    }

}