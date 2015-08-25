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
}

export class CountryFactory {
    static fromJSONCountryReviver=(key,value)=>{
        return value;
    };
}