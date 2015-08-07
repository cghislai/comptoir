/**
 * Created by cghislai on 29/07/15.
 */
import {Locale} from 'services/utils'
import {CompanyRef} from 'client/domain/company'
import {PromiseRequest} from 'client/utils/request';

export class ApplicationService {
    appName:string;
    appVersion:string;
    locale:Locale;
    companyRef:CompanyRef;
    hasError:boolean = false;
    errorContent:string;


    constructor() {
        this.locale = Locale.DEFAULT_LOCALE;
        this.companyRef = new CompanyRef();
        this.companyRef.id = 0;
    }

    showError(error: Error) {
        this.hasError = true;
        this.errorContent = error.name;
        this.errorContent += ": "+error.message;
    }

    dismissError() {
        this.hasError = false;
        this.errorContent = null;
    }

}