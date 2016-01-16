/**
 * Created by cghislai on 08/09/15.
 */

import {Auth} from '../domain/auth';
import {Employee, EmployeeRef} from '../domain/employee';
import {LocalEmployee} from './employee';

import * as Immutable from 'immutable';

export interface LocalAuth extends Immutable.Map<string, any> {
    id: number;
    employee:LocalEmployee;
    token:string;
    refreshToken: string;
    expirationDateTime: Date;
}
var AuthRecord = Immutable.Record({
    id: null,
    employee: null,
    token: null,
    refreshToken: null,
    expirationDateTime: null
});

export class LocalAuthFactory {

    static createNewAuth(desc:any):LocalAuth {
        return <any>AuthRecord(desc);
    }
}