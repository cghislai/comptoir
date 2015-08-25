/**
 * Created by cghislai on 06/08/15.
 */


import {Country, CountryRef, CountrySearch, CountryFactory} from 'client/domain/country';
import {Pagination} from 'client/utils/pagination';
import {ComptoirRequest} from 'client/utils/request';
import {SearchResult} from 'client/utils/search';
import {ServiceConfig} from 'client/utils/service';


export class CountryClient {

    private static RESOURCE_PATH:string = "/country";

    private getCountryUrl(code?:string) {
        var url = ServiceConfig.URL + CountryClient.RESOURCE_PATH;
        if (code != undefined) {
            url += "/" + code;
        }
        return url;
    }

    getCountry(code:string, authToken:string):Promise<Country> {
        var request = new ComptoirRequest();
        var url = this.getCountryUrl(code);

        return request
            .get(url, authToken)
            .then(function (response) {
                var country = JSON.parse(response.text, CountryFactory.fromJSONCountryReviver);
                return country;
            });
    }

}