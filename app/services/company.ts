/**
 * Created by cghislai on 04/08/15.
 */
import {Inject} from 'angular2/angular2';

import {Company, CompanyRef} from 'client/domain/company';
import {CompanyClient} from 'client/company';

import {AuthService} from 'services/auth';

export class CompanyService {
    private data: Company[];

    private client:CompanyClient;
    private authService:AuthService;

    constructor(@Inject authService:AuthService) {
        this.client = new CompanyClient();
        this.authService = authService;
        this.initFakeData();
    }

    createCompany(company: Company):Promise<CompanyRef> {
        var authToken = this.authService.authToken.token;
        return this.client
            .createCompany(company, authToken)
            .then(function (companyRef:CompanyRef) {
                console.log("Compagnie créée");
                return companyRef;
            }, function (error) {
                console.log("Impossible de créer une compagnie");
                console.log(error);
            }
        );
    }

    getCompany(id: number): Promise<Company> {
        var thisService = this;
        var authToken = this.authService.authToken.token;
        var promise = new Promise<Company>((resolve, reject) => {
            var company = thisService.data[id];
            resolve(company);
        });
        return promise;
    }

    searchCompanies():Promise<Company[]> {
        // TODO
        var authToken = this.authService.authToken.token;
        var thisService = this;
        var promise = new Promise<Company[]>((resolve, reject) => {
            resolve(thisService.data);
        });
        return promise;
    }

    private initFakeData() {
        var companyList = [];
        var testCompany = new Company();
        testCompany.id = 0;
        testCompany.name ={'fr': 'Test'};
        testCompany.description = {'fr': 'Compagnie de test'};
        companyList[0] = testCompany;

        var testCompany2 = new Company();
        testCompany2.id=1;
        testCompany2.name = {'fr': 'Test 2'}
        testCompany2.description = {'fr': 'Deuxième compagnie de test'}
        companyList[1] = testCompany2;
        this.data = companyList;
    }
}