/**
 * Created by cghislai on 08/09/15.
 */

import {Auth} from 'client/domain/auth';
import {Employee, EmployeeRef, EmployeeClient, EmployeeFactory} from 'client/domain/employee';
import {LocalEmployee, LocalEmployeeFactory} from 'client/localDomain/employee';

export class LocalAuth {
    id: number;
    employee:LocalEmployee;
    token:string;
    refreshToken: string;
    expirationDateTime: Date;
}

export class LocalAuthFactory {
    static toLocalAuth(auth:Auth, authToken:string):Promise<LocalAuth> {
        var localAuth = new LocalAuth();
        return LocalAuthFactory.updateLocalAuth(localAuth, auth, authToken);
    }

    static updateLocalAuth(localAuth:LocalAuth, auth:Auth, authToken:string):Promise<LocalAuth> {
        localAuth.id = auth.id;
        localAuth.token = auth.token;
        localAuth.refreshToken= auth.refreshToken;
        localAuth.expirationDateTime = auth.expirationDateTime;

        var taskList = [];
        var employeeRef = auth.employeeRef;
        var employeeClient = new EmployeeClient();
        taskList.push(
            employeeClient.getFromCacheOrServer(employeeRef.id, authToken)
                .then((emploiyee)=> {
                    return LocalEmployeeFactory.toLocalEmployee(emploiyee, authToken);
                }).then((localEmployee: LocalEmployee)=>{
                    localAuth.employee = localEmployee;
                })
        );
        return Promise.all(taskList)
            .then(()=> {
                return localAuth;
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