/**
 * Created by cghislai on 29/07/15.
 */
import {Locale} from 'services/utils'
import {CompanyRef} from 'client/domain/company'

export class ApplicationService {
    appName: string;
    appVersion: string;
    locale: Locale;
    companyRef: CompanyRef;

    constructor(){
        this.locale = Locale.DEFAULT_LOCALE;
        this.companyRef = new CompanyRef();
        this.companyRef.id = 0;
    }
}