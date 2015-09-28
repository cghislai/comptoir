/**
 * Created by cghislai on 06/08/15.
 */
import {Inject} from 'angular2/angular2';

import {LocalEmployee, LocalEmployeeFactory} from 'client/localDomain/employee';
import {EmployeeClient, Employee, EmployeeRef, EmployeeSearch} from 'client/domain/employee';

import {BasicClient} from 'client/utils/basicClient';
import {SearchRequest, SearchResult} from 'client/utils/search';

import {BasicLocalService, BasicLocalServiceInfo} from 'services/basicService';
import {AuthService} from 'services/auth';

export class EmployeeService extends BasicLocalService<Employee, LocalEmployee> {


    constructor(@Inject authService:AuthService) {
        var client = new EmployeeClient();
        super(<BasicLocalServiceInfo<Employee, LocalEmployee>>{
            client: client,
            authService: authService,
            fromLocalConverter: LocalEmployeeFactory.fromLocalEmployee,
            toLocalConverter: LocalEmployeeFactory.toLocalEmployee
        } );
    }

}