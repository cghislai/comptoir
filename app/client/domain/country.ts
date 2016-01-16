/**
 * Created by cghislai on 25/08/15.
 */

/**
 * TODO: add id?
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
    static fromJSONReviver=(key,value)=>{
        return value;
    };
}