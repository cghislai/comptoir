/**
 * Created by cghislai on 05/08/15.
 */

import {Component, View, NgFor, NgIf, FORM_DIRECTIVES} from 'angular2/angular2';

import {Company} from 'client/domain/company';
import {Employee} from 'client/domain/employee';
import {Language} from 'client/utils/lang';
import {ErrorService} from 'services/error';
import {EmployeeService} from 'services/employee';
import {CompanyService} from 'services/company';
import {AuthService} from 'services/auth';

@Component({
    selector: 'appSettings'
})
@View({
    templateUrl: './components/settings/application/appSettings.html',
    styleUrls: ['./components/settings/application/appSettings.css'],
    directives: [NgFor, NgIf, FORM_DIRECTIVES]
})
export class ApplicationSettingsView {
    errorService:ErrorService;
    companyService:CompanyService;
    authService:AuthService;
    employeeService:EmployeeService;

    companyValue:Company;
    employeeValue:Employee;
    allLanguages = Language.ALL_LANGUAGES;
    language:Language;

    constructor(errorService:ErrorService, companyService:CompanyService,
                authService:AuthService, employeeService:EmployeeService) {
        this.errorService = errorService;
        this.companyService = companyService;
        this.authService = authService;
        this.employeeValue = this.authService.loggedEmployee;
        this.employeeService = employeeService;
        this.language = authService.getEmployeeLanguage();

        this.searchCompany();
    }

    searchCompany() {
        var thisView = this;
        var companyRef = this.authService.loggedEmployee.companyRef;
        if (companyRef == null) {
            return;
        }
        this.companyService
            .getCompany(companyRef.id)
            .then(function (result:Company) {
                thisView.companyValue = result;
            }).catch((error)=> {
                this.errorService.handleRequestError(error);
            });
    }

    onLocaleSelected(event) {
        var localeValue = event.target.value;
        this.language = Language.fromLanguage(localeValue);
    }

    doSave(form) {
        if (this.employeeValue.locale != this.language.locale) {
            this.employeeValue.locale = this.language.locale;
            this.authService.loggedEmployee = this.employeeValue;
            var thisView = this;
            this.employeeService.updateEmployee(this.employeeValue)
                .catch((error)=> {
                    this.errorService.handleRequestError(error);
                });
        }
    }
}