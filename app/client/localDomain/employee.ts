/**
 * Created by cghislai on 08/09/15.
 */

import {Employee} from '../domain/employee';
import {Company, CompanyRef} from '../domain/company';

import {LocalCompany} from './company';

import * as Immutable from 'immutable';

export interface LocalEmployee extends Immutable.Map<string, any> {
    id: number;
    active: boolean;
    company: LocalCompany;
    login: string;
    firstName: string;
    lastName: string;
    locale: string;
}
var EmployeeRecord = Immutable.Record({
    id: null,
    active: null,
    company: null,
    login: null,
    firstName: null,
    lastName: null,
    locale: null
});
export class LocalEmployeeFactory {

    static createNewEmployee(desc:any):LocalEmployee {
        return <any>EmployeeRecord(desc);
    }
}