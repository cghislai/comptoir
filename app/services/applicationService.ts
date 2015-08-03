/**
 * Created by cghislai on 29/07/15.
 */
import {Language} from 'services/utils'

export class ApplicationService {
    appName: string;
    appVersion: string;
    pageName: string;
    language: Language;
    companyId: number;

    constructor(){
        this.language = Language.FRENCH;
        this.companyId = 0;
    }
}