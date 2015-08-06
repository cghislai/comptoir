/**
 * Created by cghislai on 02/08/15.
 */


import {LocaleText, LocaleTextFactory} from 'client/domain/lang';

export class Pagination {
    pageIndex: number;
    firstIndex: number;
    pageSize: number;

    constructor();
    constructor(firstIndex: number, pageSize: number);
    constructor(firstIndex?: number, pageSize?: number) {
        if (firstIndex != undefined) {
            this.firstIndex = firstIndex;
        }
        if (pageSize != undefined) {
            this.pageSize = pageSize;
        }
    }
}

export class SearchResult<T> {
    totalCount: number;
    results: T[];
}

export class Locale {
    static FRENCH = new Locale('fr', {'fr':'Français'});
    static DUTCH = new Locale('nl', {'fr':'Néerlandais'});
    static ENGLISH = new Locale('en', {'fr': 'Anglais'});

    static ALL_LOCALES = [Locale.FRENCH, Locale.DUTCH, Locale.ENGLISH];
    static DEFAULT_LOCALE = Locale.FRENCH;

    public isoCode: string;
    public label: {[locale: string] : string};

    constructor(code: string, labelMap: any) {
        this.isoCode = code;
        this.label = labelMap;
    }
    toIsoCode():string {
        return this.isoCode;
    }
    static formIsoCode(code: string): Locale {
        var foundLocale = undefined;
        Locale.ALL_LOCALES.forEach(function(locale: Locale) {
            if (locale.isoCode == code) {
                foundLocale = locale;
            }
        });
        return foundLocale;
    }
}

export enum Language {
    FRENCH,
    DUTCH,
    ENGLISH
}
