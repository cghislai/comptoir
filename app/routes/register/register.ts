/**
 * Created by cghislai on 07/08/15.
 */
import {Component} from 'angular2/core';
import {FORM_DIRECTIVES, NgFor} from 'angular2/common';
import {Router, RouterLink} from 'angular2/router';

import {AppHeader} from '../../components/app/header/appHeader';
import {FormMessage} from '../../components/utils/formMessage/formMessage';
import {LangSelect, LangSelectControl} from '../../components/lang/langSelect/langSelect';
import {RequiredValidator, PasswordValidator} from '../../components/utils/validators';
import {LocalizedDirective} from '../../components/utils/localizedInput';

import {Country} from '../../client/domain/country';
import {LocalCompany, LocalCompanyFactory} from '../../client/localDomain/company';
import {LocalEmployee, LocalEmployeeFactory} from '../../client/localDomain/employee';
import {Registration} from '../../client/domain/auth';
import {Language, LanguageFactory, LocaleTextsFactory, NewLanguage} from '../../client/utils/lang';

import {AuthService} from '../../services/auth';
import {ErrorService} from '../../services/error';
import {CompanyService} from '../../services/company';
import {EmployeeService} from '../../services/employee';

@Component({
    selector: 'register-view',
    templateUrl: './routes/register/register.html',
    styleUrls: ['./routes/register/register.css'],
    directives: [FORM_DIRECTIVES, NgFor,  RouterLink, AppHeader, FormMessage,
        LangSelect, LangSelectControl, LocalizedDirective, RequiredValidator, PasswordValidator]
})
export class RegisterView {
    authService:AuthService;
    errorService: ErrorService;
    companyService: CompanyService;
    employeeService: EmployeeService;
    router:Router;

    editingCompany: any;
    editingEmployee: any;
    password: string;

    appLanguage:Language;
    editLanguage:Language;

    constructor(authService:AuthService, errorService:ErrorService,
                companyService: CompanyService, employeeService: EmployeeService,
                router:Router) {
        this.authService = authService;
        this.errorService = errorService;
        this.companyService = companyService;
        this.employeeService = employeeService;
        this.router = router;

        this.appLanguage = NewLanguage(LanguageFactory.DEFAULT_LANGUAGE.toJS());
        this.editLanguage = NewLanguage(LanguageFactory.DEFAULT_LANGUAGE.toJS());

        this.editingCompany = {};
        this.editingCompany.description = LocaleTextsFactory.toLocaleTexts({});
        this.editingCompany.name = LocaleTextsFactory.toLocaleTexts({});
        this.editingCompany.country = new Country();
        this.editingCompany.country.code = 'BE';
        this.editingEmployee = {};
        this.editingEmployee.language = NewLanguage(LanguageFactory.DEFAULT_LANGUAGE.toJS());
    }

    doRegister() {
        var registration = new Registration();
        var localCompany:LocalCompany = LocalCompanyFactory.createNewCompany(this.editingCompany);
        var company = this.companyService.fromLocalConverter(localCompany);
        this.editingEmployee.locale = this.editingEmployee.language.locale;
        var localEmployee:LocalEmployee = LocalEmployeeFactory.createNewEmployee(this.editingEmployee);
        var employee = this.employeeService.fromLocalConverter(localEmployee);
        registration.company =company;
        registration.employee = employee;

        registration.employeePassword = this.password;

        this.authService.register(registration)
            .then((employee)=> {
                this.router.navigate(['/Sales/Sale', {id: 'active'}]);
            }).catch((error)=> {
                this.errorService.handleRequestError(error);
            });

    }


}
