/**
 * Created by cghislai on 04/08/15.
 */

import {Company, CompanyRef, CompanyFactory} from 'client/domain/company';
import {PromiseRequest} from 'client/utils/request';

export class CompanyClient {

    static serviceUrl:string = "http://somewhere.com/company";

    createCompany(company: Company) : Promise<CompanyRef> {
        var companyJSON = JSON.stringify(company);
        var request = new PromiseRequest();
        request.setup('POST', CompanyClient.serviceUrl);
        request.send(companyJSON);
        var promise = request.run();
        return promise.then(function(response) {
            var companyRef = CompanyFactory.getCompanyRefFromJSON(response);
            return companyRef;
        });
    }

    updateCompany(company: Company): Promise<CompanyRef> {
        var companyJSON = JSON.stringify(company);
        var request = new PromiseRequest();
        request.setup('PUT', CompanyClient.serviceUrl+'/'+company.id);
        request.send(companyJSON);
        var promise = request.run();
        return promise.then(function(response) {
            var companyRef = CompanyFactory.getCompanyRefFromJSON(response);
            return companyRef;
        });
    }

    getCompany(id: number): Promise<Company> {
        var request = new PromiseRequest();
        request.setup('GET', CompanyClient.serviceUrl+'/'+id);
        var promise = request.run();
        return promise.then(function(response) {
            var company= CompanyFactory.getCompanyFromJSON(response);
            return company;
        });
    }

}