/**
 * Created by cghislai on 20/08/15.
 */

import {Component, View, Directive, ChangeDetectionStrategy, NgControl,
    EventEmitter, NgFor,  NgIf, ElementRef, Attribute, ControlValueAccessor} from 'angular2/angular2';
import {Language, LanguageFactory, LocaleTexts, NewLanguage} from '../../../client/utils/lang';
import {AuthService} from '../../../services/auth';
import {List} from 'immutable';
/**
 * A language selection component.
 */
@Component({
    selector: 'langSelect:not([ng-control])',
    inputs: ['displayLanguage', 'selectedLanguage', 'dropDown', 'id'],
    outputs: ['languageChanged'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
@View({
    templateUrl: './components/lang/langSelect/langSelect.html',
    styleUrls: ['./components/lang/langSelect/langSelect.html'],
    directives: [NgFor, NgIf]
})
export class LangSelect  {

    displayLanguage:Language;
    selectedLanguage:Language;
    allLanguages: List<Language>;
    languageChanged:EventEmitter = new EventEmitter();

    dropDown:boolean;
    id:string;

    constructor(authService:AuthService, @Attribute("id") id:string) {
        this.id = id;
        this.allLanguages = LanguageFactory.ALL_LANGUAGES;
    }

    onLanguageSelected(language:Language) {
        this.selectedLanguage = language;
        this.languageChanged.next(language);
    }

    getId(locale: string) {
        return this.id+"_"+locale;
    }
}

@Component({
    selector: 'langSelect[ng-control]',
    inputs: ['displayLanguage', 'selectedLanguage', 'dropDown', 'id'],
    outputs: ['languageChanged'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
@View({
    templateUrl: './components/lang/langSelect/langSelect.html',
    styleUrls: ['./components/lang/langSelect/langSelect.html'],
    directives: [NgFor, NgIf]
})
export class LangSelectControl  implements ControlValueAccessor {
    onChange: Function;
    onTouched: Function;

    displayLanguage:Language;
    selectedLanguage:Language;
    allLanguages: List<Language>;
    languageChanged:EventEmitter = new EventEmitter();

    dropDown:boolean;
    id:string;

    constructor(authService:AuthService, @Attribute("id") id:string, cd: NgControl) {
        this.id = id;
        this.allLanguages = LanguageFactory.ALL_LANGUAGES;
        this.onChange = (_) => {};
        this.onTouched = (_) => {};
        cd.valueAccessor = this;
    }

    onLanguageSelected(language:Language) {
        this.selectedLanguage = language;
        this.languageChanged.next(language);
        this.onChange(language);
    }

    getId(locale: string) {
        return this.id+"_"+locale;
    }

    registerOnChange(fn:any):void {
        this.onChange = fn;
    }

    registerOnTouched(fn:any):void {
        this.onTouched = fn;
    }

    writeValue(obj:any):void {
        if (obj != null) {
            this.onLanguageSelected(obj);
        }
    }
}