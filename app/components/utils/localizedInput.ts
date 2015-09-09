/**
 * Created by cghislai on 08/09/15.
 */

import {Directive,ElementRef} from 'angular2/angular2';

import {Language, LocaleTexts} from 'client/utils/lang';
/**
 * A localized input directive. Add the 'localized' attribute on a input/textarea field to use.
 * Bind the 'language' property to a Language instance.
 * Bind the 'locale-texts' property to a LcoaleTexts instance.
 * If the 'required' attribute is set, a value in at least 1 language is required.
 */
@Directive({
    selector: 'input[localized], textarea[localized]',
    properties: ['languageProp: language', 'localeTextsProp: localeTexts', 'requiredProp: required'],
    host: {
        '(input)': "onInput($event)"
    }
})
export class LocalizedDirective {
    language:Language;
    previousLanguage:Language;
    localeTexts:LocaleTexts;
    elementRef:ElementRef;

    // attribute set on the element
    requiredAttribute:boolean;
    // field to update the actual attribute
    required:boolean;

    placeHolderAttribute:string;

    constructor(elementRef:ElementRef) {
        this.elementRef = elementRef;
        this.placeHolderAttribute = this.elementRef.nativeElement.placeholder;
    }

    resetPlaceHolder() {
        this.elementRef.nativeElement.placeholder = this.placeHolderAttribute;
    }

    update() {
        if (this.localeTexts == null || this.language == null) {
            return;
        }
        var placeHolderValue:string = null;
        if (this.previousLanguage != null) {
            placeHolderValue = this.localeTexts[this.previousLanguage.locale];
        }
        if (placeHolderValue == null) {
            var langWithContent = this.findLangWithContent();
            if (langWithContent != null) {
                placeHolderValue = this.localeTexts[langWithContent.locale];
            }
        }
        if (placeHolderValue == null) {
            placeHolderValue = this.placeHolderAttribute;
        }

        var text = this.localeTexts[this.language.locale];
        if (text == null || text.length == 0) {
            this.elementRef.nativeElement.placeholder = placeHolderValue;
        }
        if (text == null) {
            text = '';
        }
        this.elementRef.nativeElement.value = text;
        this.updateRequired();
    }

    findLangWithContent():Language {
        if (this.localeTexts == null) {
            return null;
        }
        var allLanguages = Language.ALL_LANGUAGES;
        for (var lang of allLanguages) {
            var locale = lang.locale;
            var text = this.localeTexts[locale];
            if (text != null && text.length > 0) {
                return lang;
            }
        }
        return null;
    }

    updateRequired() {
        if (this.requiredAttribute == null) {
            this.required = false;
            this.elementRef.nativeElement.required = false;
            return;
        }
        var lang = this.findLangWithContent();
        // Not required if some content in other language
        this.required = lang == null;
        this.elementRef.nativeElement.required = this.required;
    }

    onInput(event) {
        var value = event.target.value;
        this.localeTexts[this.language.locale] = value;
        this.updateRequired();
    }

    set languageProp(value:Language) {
        this.previousLanguage = this.language;
        this.language = value;
        this.update();
    }

    set localeTextsProp(value:LocaleTexts) {
        this.localeTexts = value;
        this.update();
    }

    set requiredProp(value:any) {
        this.requiredAttribute = value;
        this.updateRequired();
    }
}