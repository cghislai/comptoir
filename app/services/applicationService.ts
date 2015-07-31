/**
 * Created by cghislai on 29/07/15.
 */
export enum Language {
    FRENCH,
    DUTCH,
    ENGLISH
}
export class ApplicationService {
    appName: string;
    appVersion: string;
    pageName: string;
    language: Language;

    constructor(){
        this.language = Language.FRENCH;
    }
}