/**
 * Created by cghislai on 04/08/15.
 */

import {LocaleText} from 'client/domain/lang';
import {Company, CompanyRef} from 'client/domain/company';
import {CompanyClient} from 'client/company';
import {Locale} from 'services/utils';


export class CompanyService {
    private client:CompanyClient;

    companies:Company[];

    constructor() {
        this.client = new CompanyClient();
    }

    createCompany(locale: Locale, name:string, desc:string):Promise<CompanyRef> {
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

}