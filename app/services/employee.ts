/**
 * Created by cghislai on 07/08/15.
 */
import {Inject} from 'angular2/angular2';

import {CompanyRef} from 'client/domain/company';
import {Employee,EmployeeRef} from 'client/domain/employee';
import {EmployeeClient} from 'client/employee';

import {AuthService} from 'services/auth';

export class EmployeeService {
    fakeData: Employee[];
    client: EmployeeClient;
    authService :AuthService;

    constructor(@Inject authService:AuthService) {
        this.initFakeData();
        this.client = new EmployeeClient();
        this.authService = authService;
    }

    getEmployee(id: number) : Promise<Employee> {
        var authToken = this.authService.authToken;
        // FIXME
        var thisService = this;
        return new Promise((resolve, reject)=>{
            for (var emp of thisService.fakeData) {
                if (emp.id == id)  {
                    resolve(emp);
                    return;
                }
            }
            resolve(null);
        });
        //return this.client.getEmployee(id);
    }

    updateEmployee(employee: Employee): Promise<EmployeeRef> {
        var authToken = this.authService.authToken;
        return this.client.updateEmployee(employee, authToken);
    }

    initFakeData() {
        this.fakeData = [];
        var companyRef = new CompanyRef();
        companyRef.id = 0;

        var emp0 = new Employee();
        emp0.active = true;
        emp0.companyRef = companyRef;
        emp0.firstName = "Marcel";
        emp0.id = 0;
        emp0.lastName = "pagnol";
        emp0.locale = 'fr';
        emp0.login = 'mpagnol';
        this.fakeData.push(emp0);

        var emp1 = new Employee();
        emp1.active = true;
        emp1.companyRef = companyRef;
        emp1.firstName = "John";
        emp1.id = 0;
        emp1.lastName = "Page";
        emp1.locale = 'en';
        emp1.login = 'john';
        this.fakeData.push(emp1);
    }
}