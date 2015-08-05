/**
 * Created by cghislai on 29/07/15.
 */
import {Locale} from 'services/utils'

export class ApplicationService {
    appName: string;
    appVersion: string;
    pageName: string;
    locale: Locale;
    companyId: number;

    constructor(){
        this.locale = Locale.DEFAULT_LOCALE;
        this.companyId = 0;
    }
}