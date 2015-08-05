/**
 * Created by cghislai on 04/08/15.
 */

import {LocaleText, LocaleTextFactory} from 'client/domain/lang';

export class Company {
    id: number;
    name: LocaleText;
    description: LocaleText;
}

export class CompanyRef {
    link: string;
    id: number;
}

export class CompanyFactory {

    static getCompanyRefFromJSON(jsonObject: any) : CompanyRef {
        if (jsonObject === undefined) {
            return undefined;
        }
        var companyRef = new CompanyRef();
        companyRef.id = jsonObject.id;
        companyRef.link = jsonObject.link;
        return companyRef;
    }

    static getCompanyFromJSON(jsonObject: any) : Company {
        if (jsonObject === undefined) {
            return undefined;
        }
        var company = new Company();
        company.id = jsonObject.id;
        company.name = LocaleTextFactory.getLocaleTextFromJSON(jsonObject.name);
        company.description = LocaleTextFactory.getLocaleTextFromJSON(jsonObject.description);
        return company;
    }
}