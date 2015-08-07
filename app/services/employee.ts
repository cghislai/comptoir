/**
 * Created by cghislai on 07/08/15.
 */

import {Employee} from 'client/domain/employee';
import {EmployeeClient} from 'client/employee';
import {CompanyRef} from 'client/domain/company';

export class EmployeeService {
    fakeData: Employee[];
    client: EmployeeClient;

    constructor() {
        this.initFakeData();
        this.client = new EmployeeClient();
    }

    getEmployee(id: number) : Promise<Employee> {
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