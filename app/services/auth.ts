/**
 * Created by cghislai on 07/08/15.
 */
import {Inject, forwardRef} from 'angular2/angular2';
import {EmployeeLoginRequest,EmployeeLoginResponse, AuthToken} from 'client/domain/auth';
import {EmployeeRef, Employee} from 'client/domain/employee';
import {CompanyRef} from 'client/domain/company';
import {AuthClient} from 'client/auth';
import {EmployeeService} from 'services/employee';
import {ApplicationService} from 'services/application';
import {Locale} from 'services/utils';

export enum LoginRequiredReason {
    NO_SESSION,
    SESSION_EXPIRED
}

export class AuthService {
    client:AuthClient;
    employeeService:EmployeeService;
    applicationService:ApplicationService;

    loggedEmployeeRef:EmployeeRef;
    loggedEmployee:Employee;
    companyRef:CompanyRef;
    authToken:AuthToken;
    loginRequired:boolean;
    loginRequiredReason:LoginRequiredReason;

    constructor(@Inject employeeService:EmployeeService,
                @Inject appService:ApplicationService) {
        this.client = new AuthClient();
        this.employeeService = employeeService;
        this.applicationService = appService;
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
                thisService.onEmployeeLoggedIn(loginResponse);
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

    private onEmployeeLoggedIn(response:EmployeeLoginResponse) {
        if (!response.sucess) {
            return;
        }
        var thisService = this;
        this.loggedEmployeeRef = response.employeeRef;
        this.authToken = response.authToken;
        this.employeeService.getEmployee(response.employeeRef.id)
            .then(function (employee) {
                thisService.onEmployeeFetched(employee);
            });
    }

    private onEmployeeFetched(employee:Employee) {
        this.companyRef = employee.companyRef;
        this.loggedEmployee = employee;
        var locale = Locale.formIsoCode(employee.locale);
        this.applicationService.locale = locale;
    }

    checkLoginRequired() {
        if (this.authToken == null) {
            this.loginRequired = true;
            this.loginRequiredReason = LoginRequiredReason.NO_SESSION;
            return true;
        }
        var expireDate = this.authToken.validity;

        if (Date.now() >= expireDate.getTime()) {
            this.loginRequired = true;
            this.loginRequiredReason = LoginRequiredReason.SESSION_EXPIRED;
            return true;
        }
        this.loginRequired = false;
        this.loginRequiredReason = null;
        return false;
    }

}