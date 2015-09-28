/**
 * Created by cghislai on 08/09/15.
 */

import {Company, CompanyRef} from 'client/domain/company';
import {LocaleTexts, LocaleTextsFactory} from 'client/utils/lang';
import {Country, CountryRef, CountryFactory} from 'client/domain/country';
import {CountryClient} from 'client/country';

import {Map} from 'immutable';

export interface LocalCompany extends Map<string, any> {
    id: number;
    name: LocaleTexts;
    description: LocaleTexts;
    country: Country;
}

export class LocalCompanyFactory {
    static  countryClient = new CountryClient();

    static toLocalCompany(company:Company, authToken:string):Promise<LocalCompany> {
        var localCompanyDesc:any = {};
        localCompanyDesc.description = company.description;
        localCompanyDesc.id = company.id;
        localCompanyDesc.name = company.name;

        var taskList = [];
        var countryRef = company.countryRef;
        taskList.push(
            LocalCompanyFactory.countryClient.getFromCacheOrServer(countryRef.code, authToken)
                .then((country)=> {
                    localCompanyDesc.country = country;
                })
        );
        return Promise.all(taskList)
            .then(()=> {
                var localCompany:LocalCompany = <LocalCompany>Map(localCompanyDesc);
                return localCompany;
            });
    }

    static fromLocalCompany(localCompany:LocalCompany):Company {
        var company = new Company();
        company.id = localCompany.id;
        company.countryRef = new CountryRef(localCompany.country.code);
        company.description = localCompany.description;
        company.name = localCompany.name;
        return company;
    }
}