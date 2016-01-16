/**
 * Created by cghislai on 20/08/15.
 */

import {Component, View, ChangeDetectionStrategy, EventEmitter, Attribute} from 'angular2/core'
import {NgFor,  NgIf, NgControl,  ControlValueAccessor} from 'angular2/common';
import {Language, LanguageFactory} from '../../../client/utils/lang';
import {AuthService} from '../../../services/auth';
import * as Immutable from 'immutable';
/**
 * A language selection component.
 */
@Component({
    selector: 'lang-select:not([ngControl])',
    inputs: ['displayLanguage', 'selectedLanguage', 'dropDown', 'id'],
    outputs: ['languageChanged'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './components/lang/langSelect/langSelect.html',
    styleUrls: ['./components/lang/langSelect/langSelect.css'],
    directives: [NgFor, NgIf]
})
export class LangSelect {

    displayLanguage:Language;
    selectedLanguage:Language;
    allLanguages:Immutable.List<Language>;
    languageChanged = new EventEmitter();

    dropDown:boolean;
    id:string;

    constructor(authService:AuthService, @Attribute('id') id:string) {
        this.id = id;
        this.allLanguages = LanguageFactory.ALL_LANGUAGES;
    }

    onLanguageSelected(language:Language) {
        this.selectedLanguage = language;
        this.languageChanged.next(language);
    }

    getId(locale:string) {
        return this.id + '_' + locale;
    }
}

@Component({
    selector: 'lang-select[ngControl]',
    inputs: ['displayLanguage', 'selectedLanguage', 'dropDown', 'id'],
    outputs: ['languageChanged'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './components/lang/langSelect/langSelect.html',
    styleUrls: ['./components/lang/langSelect/langSelect.css'],
    directives: [NgFor, NgIf]
})
export class LangSelectControl implements ControlValueAccessor {
    onChange:Function;
    onTouched:Function;

    displayLanguage:Language;
    selectedLanguage:Language;
    allLanguages:Immutable.List<Language>;
    languageChanged = new EventEmitter();

    dropDown:boolean;
    id:string;

    constructor(authService:AuthService, @Attribute('id') id:string, cd:NgControl) {
        this.id = id;
        this.allLanguages = LanguageFactory.ALL_LANGUAGES;
        this.onChange = (_) => {
        };
        this.onTouched = (_) => {
        };
        cd.valueAccessor = this;
    }

    onLanguageSelected(language:Language) {
        this.selectedLanguage = language;
        this.languageChanged.next(language);
        this.onChange(language);
    }

    getId(locale:string) {
        return this.id + '_' + locale;
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
