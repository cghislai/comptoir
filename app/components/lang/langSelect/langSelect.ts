/**
 * Created by cghislai on 20/08/15.
 */

import {Component, View, Directive, ChangeDetectionStrategy,
    EventEmitter, NgFor,  NgIf, ElementRef} from 'angular2/angular2';
import {Language, LanguageFactory, LocaleTexts} from 'client/utils/lang';
import {AuthService} from 'services/auth';
import {List} from 'immutable';
/**
 * A language selection component.
 */
@Component({
    selector: 'langSelect',
    properties: ['displayLanguage', 'selectedLanguage', 'dropDown'],
    events: ['languageChanged'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
@View({
    templateUrl: './components/lang/langSelect/langSelect.html',
    styleUrls: ['./components/lang/langSelect/langSelect.html'],
    directives: [NgFor, NgIf]
})
export class LangSelect {
    displayLanguage:Language;
    selectedLanguage:Language;
    allLanguages: List<Language>;
    languageChanged:EventEmitter;
    dropDown:boolean;

    constructor(authService:AuthService) {
        this.allLanguages = LanguageFactory.ALL_LANGUAGES;
        this.selectedLanguage = authService.getEmployeeLanguage();
        this.languageChanged = new EventEmitter();
    }

    onLanguageSelected(language:Language) {
        this.selectedLanguage = language;
        this.languageChanged.next(language);
    }
}

