/**
 * Created by cghislai on 04/08/15.
 */

import {LocaleText, LocaleTextFactory} from 'client/domain/lang';
import {LocaleTexts, LocaleTextsFactory} from 'client/utils/lang';

export class Company {
    id: number;
    name: LocaleTexts;
    description: LocaleTexts;
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
        var names = LocaleTextFactory.getLocaleTextArrayFromJSON(jsonObject.name);
        company.name = LocaleTextsFactory.getLocaleTextsFromTextArray(names);
        var descriptions = LocaleTextFactory.getLocaleTextArrayFromJSON(jsonObject.description);
        company.description = LocaleTextsFactory.getLocaleTextsFromTextArray(descriptions);
        return company;
    }
}