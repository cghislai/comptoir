/**
 * Created by cghislai on 20/08/15.
 */

import {Component, View, Directive,
    EventEmitter, NgFor,  NgIf, ElementRef} from 'angular2/angular2';
import {Language, LocaleTexts} from 'client/utils/lang';
import {AuthService} from 'services/auth';

/**
 * A language selection component.
 */
@Component({
    selector: 'langSelect',
    properties: ['displayLocale', 'selectedLanguage', 'dropDown'],
    events: ['languageChanged']
})
@View({
    templateUrl: './components/lang/langSelect/langSelect.html',
    styleUrls: ['./components/lang/langSelect/langSelect.html'],
    directives: [NgFor, NgIf]
})
export class LangSelect {
    displayLocale:string;
    selectedLanguage:Language;
    allLanguages:Language[];
    languageChanged:EventEmitter;
    dropDown:boolean;

    constructor(authService:AuthService) {
        this.allLanguages = Language.ALL_LANGUAGES;
        this.selectedLanguage = authService.getEmployeeLanguage();
        this.languageChanged = new EventEmitter();
    }

    onLanguageSelected(locale:string) {
        var lang:Language = Language.fromLocale(locale);
        this.selectedLanguage = lang;
        this.languageChanged.next(lang);
    }
}

