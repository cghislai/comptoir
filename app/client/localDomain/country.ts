/**
 * Created by cghislai on 08/09/15.
 */

import * as Immutable from 'immutable';

export interface LocalCountry extends Immutable.Map<string, any> {
    code: string;
    defaultVatRate: number;
}
var CountryRecord = Immutable.Record({
    code: null,
    defaultVatRate: null
});

export class LocalCountryFactory {

    static createNewCountry(desc:any):LocalCountry {
        return <any>CountryRecord(desc);
    }
}