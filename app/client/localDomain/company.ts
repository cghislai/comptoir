/**
 * Created by cghislai on 08/09/15.
 */

import {Company, CompanyRef} from '../domain/company';
import {LocaleTexts, LocaleTextsFactory} from '../utils/lang';
import {Country, CountryRef, CountryFactory} from '../domain/country';
import {CountryClient} from '../country';

import * as Immutable from 'immutable';

export interface LocalCompany extends Immutable.Map<string, any> {
    id: number;
    name: LocaleTexts;
    description: LocaleTexts;
    country: Country;
}
var CompanyRecord = Immutable.Record({
    id: null,
    name: null,
    description: null,
    country: null
});
export function NewCompany(desc: any) : LocalCompany {
    return <any>CompanyRecord(desc);
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
                return NewCompany(localCompanyDesc);
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