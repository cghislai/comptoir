/**
 * Created by cghislai on 29/07/15.
 */
import {Locale} from 'services/utils'
import {Company, CompanyRef} from 'client/domain/company'

export class ApplicationService {
    appName: string;
    appVersion: string;
    locale: Locale;
    company: Company;

    constructor(){
        this.locale = Locale.DEFAULT_LOCALE;
    }
}