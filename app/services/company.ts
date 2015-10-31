/**
 * Created by cghislai on 06/08/15.
 */
import {Inject} from 'angular2/angular2';

import {LocalCompany, LocalCompanyFactory} from '../client/localDomain/company';
import {CompanyClient, Company,  CompanyRef} from '../client/domain/company';

import {BasicClient} from '../client/utils/basicClient';
import {SearchRequest, SearchResult} from '../client/utils/search';

import {BasicLocalService, BasicLocalServiceInfo} from './basicService';
import {AuthService} from './auth';

export class CompanyService extends BasicLocalService<Company, LocalCompany> {


    constructor( authService:AuthService) {
        var client = new CompanyClient();
        super(<BasicLocalServiceInfo<Company, LocalCompany>>{
            client: client,
            authService: authService,
            fromLocalConverter: LocalCompanyFactory.fromLocalCompany,
            toLocalConverter: LocalCompanyFactory.toLocalCompany
        } );
    }

}