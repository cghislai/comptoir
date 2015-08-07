/**
 * Created by cghislai on 05/08/15.
 */

import {Component, View, NgFor, NgIf, formDirectives} from 'angular2/angular2';

import {Company} from 'client/domain/company';
import {Employee} from 'client/domain/employee';
import {Locale} from 'services/utils';
import {ApplicationService} from 'services/application';
import {EmployeeService} from 'services/employee';
import {CompanyService} from 'services/company';
import {AuthService} from 'services/auth';

@Component({
    selector: 'appSettings'
})
@View({
    templateUrl: './components/settings/application/appSettings.html',
    styleUrls: ['./components/settings/application/appSettings.css'],
    directives: [NgFor, NgIf, formDirectives]
})
export class ApplicationSettingsView {
    applicationService:ApplicationService;
    companyService:CompanyService;
    authService: AuthService;
    employeeService: EmployeeService;

    companyValue:Company;
    employeeValue: Employee;
    localeList:Locale[];
    localeValue:Locale;

    constructor(applicationService:ApplicationService, companyService:CompanyService,
                authService:AuthService, employeeService: EmployeeService) {
        this.applicationService = applicationService;
        this.companyService = companyService;
        this.authService = authService;
        this.employeeValue = this.authService.loggedEmployee;
        this.employeeService = employeeService;

        this.searchCompany();
        this.localeList = Locale.ALL_LOCALES;
        this.localeValue = applicationService.locale;
    }

    searchCompany() {
        var thisView = this;
        var companyRef = this.authService.companyRef;
        if (companyRef == null) {
            return;
        }
        this.companyService
            .getCompany(companyRef.id)
            .then(function (result:Company) {
                thisView.companyValue = result;
            });
    }

    onLocaleSelected(event) {
        var localeValue = event.target.value;
        this.localeValue = Locale.formIsoCode(localeValue);
    }

    doSave(form) {
        if (this.employeeValue.locale != this.localeValue.isoCode) {
            this.employeeValue.locale = this.localeValue.isoCode;
            this.authService.loggedEmployee = this.employeeValue;
            var thisView = this;
            this.employeeService.updateEmployee(this.employeeValue)
            .catch(function(error) {
                    thisView.applicationService.showError(error);
                });
        }
    }
}