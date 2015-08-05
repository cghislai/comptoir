/**
 * Created by cghislai on 04/08/15.
 */

import {LocaleText, LocaleTextFactory} from 'client/domain/lang';
import {Company, CompanyRef} from 'client/domain/company';
import {CompanyClient} from 'client/company';
import {Locale} from 'services/utils';


export class CompanyService {
    private data: Company[];

    private client:CompanyClient;

    constructor() {
        this.client = new CompanyClient();
        this.initFakeData();
    }

    createCompany(locale:Locale, name:string, desc:string):Promise<CompanyRef> {
        var company = new Company();
        company.name = new LocaleText();
        company.name[locale.isoCode] = name;
        company.description = new LocaleText();
        company.description[locale.isoCode] = desc;

        return this.client
            .createCompany(company)
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
        var promise = new Promise<Company>((resolve, reject) => {
            var company = thisService.data[id];
            resolve(company);
        });
        return promise;
    }

    searchCompanies():Promise<Company[]> {
        // TODO
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
        testCompany.name = LocaleTextFactory.getLocaleTextFromJSON({
            localeTextMap: {'fr': 'Test'}
        });
        testCompany.description = LocaleTextFactory.getLocaleTextFromJSON({
            localeTextMap: {'fr': 'Compagnie de test'}
        });
        companyList[0] = testCompany;

        var testCompany2 = new Company();
        testCompany2.id=1;
        testCompany2.name = LocaleTextFactory.getLocaleTextFromJSON({
            localeTextMap: {'fr': 'Test 2'}
        });
        testCompany2.description = LocaleTextFactory.getLocaleTextFromJSON({
            localeTextMap: {'fr': 'Deuxième compagnie de test'}
        });
        companyList[1] = testCompany2;
        this.data = companyList;
    }
}