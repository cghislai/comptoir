/**
 * Created by cghislai on 07/08/15.
 */
import {Inject, forwardRef} from 'angular2/angular2';
import {EmployeeLoginRequest,EmployeeLoginResponse, AuthToken} from 'client/domain/auth';
import {EmployeeRef, Employee} from 'client/domain/employee';
import {CompanyRef} from 'client/domain/company';
import {AuthClient} from 'client/auth';
import {EmployeeService} from 'services/employee';

export enum LoginRquiredReason {
    NO_SESSION,
    SESSION_EXPIRED
}

export class AuthService {
    client:AuthClient;
    employeeService: EmployeeService;
    loggedEmployeeRef:EmployeeRef;
    loggedEmployee:Employee;
    companyRef:CompanyRef;
    authToken:AuthToken;
    loginRequired:boolean;
    loginRequiredReason:LoginRquiredReason;

    constructor(@Inject employeeService: EmployeeService) {
        this.client = new AuthClient();
        this.employeeService = employeeService;
        this.authToken = null;
    }

    login(login:string, password:string):Promise<EmployeeLoginResponse> {
        var loginRequest = new EmployeeLoginRequest();
        loginRequest.login = login;
        loginRequest.password = password;
        var thisService = this;
        // FIXME
        return new Promise((resolve, reject)=> {
            var response = new EmployeeLoginResponse();
            if (Math.random() < .3) {
                console.log("random: " + Math.random());
                response.sucess = false;
                response.errorReaseon = "Fake random fail. Try again :)";
                resolve(response);
                return;
            }
            var expireDate = new Date();
            var hours = expireDate.getHours();
            var minutes = expireDate.getMinutes();
            minutes += 30;
            if (minutes > 60) {
                hours += 1;
                minutes -= 60;
            }
            expireDate.setMinutes(minutes);
            expireDate.setHours(hours);
            var token = new AuthToken();
            token.validity = expireDate;
            token.token = "mdslfse";
            response.authToken = token;
            var employeeRef = new EmployeeRef();
            employeeRef.id = 0;
            response.employeeRef = employeeRef;
            response.sucess = true;
            resolve(response);
        }).then(function (loginResponse:EmployeeLoginResponse) {
                if (!loginResponse.sucess) {
                    return loginResponse;
                }
                thisService.loggedEmployeeRef = loginResponse.employeeRef;
                thisService.authToken = loginResponse.authToken;
                thisService.employeeService.getEmployee(loginResponse.employeeRef.id)
                    .then(function (employee) {
                        thisService.companyRef = employee.companyRef;
                        thisService.loggedEmployee = employee;
                    });
                return loginResponse;
            });
        /*
         return this.client
         .login(loginRequest)
         .then(function (loginResponse:EmployeeLoginResponse) {
         if (!loginResponse.sucess) {
         return loginResponse;
         }
         thisService.loggedEmployee = loginResponse.employeeRef;
         thisService.authToken = loginResponse.authToken;
         return loginResponse;
         });*/
    }

    checkLoginRequired() {
        if (this.authToken == null) {
            this.loginRequired = true;
            this.loginRequiredReason = LoginRquiredReason.NO_SESSION;
            return true;
        }
        var expireDate = this.authToken.validity;

        if (Date.now() >= expireDate.getTime()) {
            this.loginRequired = true;
            this.loginRequiredReason = LoginRquiredReason.SESSION_EXPIRED;
            return true;
        }
        this.loginRequired = false;
        this.loginRequiredReason = null;
        return false;
    }

}