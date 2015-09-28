/**
 * Created by cghislai on 08/09/15.
 */

import {Auth} from 'client/domain/auth';
import {Employee, EmployeeRef, EmployeeClient, EmployeeFactory} from 'client/domain/employee';
import {LocalEmployee, LocalEmployeeFactory} from 'client/localDomain/employee';

import {Map, Record} from 'immutable';

export interface LocalAuth extends Map<string, any> {
    id: number;
    employee:LocalEmployee;
    token:string;
    refreshToken: string;
    expirationDateTime: Date;
}
var AuthRecord = Record({
    id: null,
    employee: null,
    token: null,
    refreshToken: null,
    expirationDateTime: null
});
export function NewAuth(desc: any) : LocalAuth {
    return <any>AuthRecord(desc);
}

export class LocalAuthFactory {
    static employeeClient = new EmployeeClient();

    static toLocalAuth(auth:Auth, authToken:string):Promise<LocalAuth> {
        var localAuthDesc: any = {};
        localAuthDesc.id = auth.id;
        localAuthDesc.token = auth.token;
        localAuthDesc.refreshToken= auth.refreshToken;
        localAuthDesc.expirationDateTime = auth.expirationDateTime;

        var taskList = [];
        var employeeRef = auth.employeeRef;
        taskList.push(
            LocalAuthFactory.employeeClient.getFromCacheOrServer(employeeRef.id, authToken)
                .then((emploiyee)=> {
                    return LocalEmployeeFactory.toLocalEmployee(emploiyee, authToken);
                }).then((localEmployee: LocalEmployee)=>{
                    localAuthDesc.employee = localEmployee;
                })
        );
        return Promise.all(taskList)
            .then(()=> {
                return NewAuth(localAuthDesc);
            });
    }

    static fromLocalAuth(localAuth:LocalAuth):Auth {
        var auth = new Auth();
        auth.id = localAuth.id;
        auth.token = localAuth.token;
        auth.refreshToken = localAuth.refreshToken;
        auth.expirationDateTime = localAuth.expirationDateTime;
        auth.employeeRef = new EmployeeRef(localAuth.employee.id);
        return auth;
    }
}