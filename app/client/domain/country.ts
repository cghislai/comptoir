/**
 * Created by cghislai on 25/08/15.
 */

export class Country {
    code: string;
    defaultVatRate: number;
}

export class CountryRef {
    code: string;
    link: string;
    constructor(code?: string) {
        this.code = code;
    }
}

export class CountryFactory {
    static fromJSONCountryReviver=(key,value)=>{
        return value;
    };

    static cache: {[code: string] : Country} = {};
    static putInCache(country: Country) {
        var countryCode = country.code;
        if (countryCode ===null) {
            throw 'no id';
        }
        CountryFactory.cache[countryCode] = country;
    }

    static getFromCache(code: string) {
        return CountryFactory.cache[code];
    }

    static clearFromCache(code: string) {
        delete CountryFactory.cache[code];
    }

    static clearCache() {
        CountryFactory.cache = {};
    }
}