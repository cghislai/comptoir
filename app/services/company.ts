/**
 * Created by cghislai on 04/08/15.
 */
import {Inject} from 'angular2/angular2';

import {Company, CompanyRef} from 'client/domain/company';
import {CompanyClient} from 'client/company';

import {AuthService} from 'services/auth';

export class CompanyService {
    private client:CompanyClient;
    private authService:AuthService;

    constructor(@Inject authService:AuthService) {
        this.client = new CompanyClient();
        this.authService = authService;
    }

    createCompany(company: Company):Promise<CompanyRef> {
        var authToken = this.authService.authToken;
        return this.client
            .createCompany(company, authToken)
            .then(function (companyRef:CompanyRef) {
                return companyRef;
            }
        );
    }

    getCompany(id: number): Promise<Company> {
        var thisService = this;
        var authToken = this.authService.authToken;

        return this.client.getCompany(id, authToken);
    }

    searchCompanies():Promise<Company[]> {
        // TODO
        var authToken = this.authService.authToken;
        var thisService = this;
        return null;
    }
}