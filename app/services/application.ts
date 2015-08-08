/**
 * Created by cghislai on 29/07/15.
 */
import {CompanyRef} from 'client/domain/company'
import {Language} from 'client/utils/lang'


export class ApplicationService {
    appName:string;
    appVersion:string;
    language: Language;
    hasError:boolean = false;
    errorContent:string;


    constructor() {
        this.language = Language.DEFAULT_LANGUAGE;
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