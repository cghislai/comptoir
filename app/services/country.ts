/**
 * Created by cghislai on 07/08/15.
 */
import {Injectable} from 'angular2/core';

import {Country, CountryFactory} from '../client/domain/country';
import {LocalCountry, LocalCountryFactory} from '../client/localDomain/country';


import {CountryClient} from '../client/country';


/**
 * Required by authService: Auth->employee->company->country
 * Do not inject
 */
@Injectable()
export class CountryService {
    countryClient:CountryClient;

    constructor(countryClient:CountryClient) {
        this.countryClient = countryClient;
    }

    get(code:string, authToken:string):Promise<Country> {
        return this.countryClient.getFromCacheOrServer(code, authToken);
    }
}
