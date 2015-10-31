/**
 * Created by cghislai on 07/08/15.
 */
import {Component, View, FORM_DIRECTIVES, NgFor, DefaultValueAccessor} from 'angular2/angular2';
import {Router, RouterLink} from 'angular2/router';

import {AppHeader} from '../../components/app/header/appHeader';
import {FormMessage} from '../../components/utils/formMessage/formMessage';
import {LangSelect, LangSelectControl} from '../../components/lang/langSelect/langSelect';
import {RequiredValidator, PasswordValidator} from '../../components/utils/validators';
import {LocalizedDirective} from '../../components/utils/localizedInput';

import {Country, CountryFactory} from '../../client/domain/country';
import {LocalCompany, LocalCompanyFactory, NewCompany} from '../../client/localDomain/company';
import {LocalEmployee, LocalEmployeeFactory, NewEmployee} from '../../client/localDomain/employee';
import {Registration} from '../../client/domain/auth';
import {LocaleTexts, Language, LanguageFactory, LocaleTextsFactory, NewLanguage} from '../../client/utils/lang';

import {AuthService} from '../../services/auth';
import {ErrorService} from '../../services/error';

import * as Immutable from 'immutable';

@Component({
    selector: "registerView"
})
@View({
    templateUrl: './routes/register/register.html',
    styleUrls: ['./routes/register/register.css'],
    directives: [FORM_DIRECTIVES, NgFor,  RouterLink, AppHeader, FormMessage,
        LangSelect, LangSelectControl, LocalizedDirective, RequiredValidator, PasswordValidator]
})
export class RegisterView {
    authService:AuthService;
    errorService: ErrorService;
    router:Router;

    editingCompany: any;
    editingEmployee: any;
    password: string;

    appLanguage:Language;
    editLanguage:Language;

    constructor(authService:AuthService, errorService:ErrorService,
                router:Router) {
        this.authService = authService;
        this.errorService = errorService;
        this.router = router;

        this.appLanguage = NewLanguage(LanguageFactory.DEFAULT_LANGUAGE.toJS());
        this.editLanguage = NewLanguage(LanguageFactory.DEFAULT_LANGUAGE.toJS());

        this.editingCompany = {};
        this.editingCompany.description = LocaleTextsFactory.toLocaleTexts({});
        this.editingCompany.name = LocaleTextsFactory.toLocaleTexts({});
        this.editingCompany.country = new Country();
        this.editingCompany.country.code = "BE";
        this.editingEmployee = {};
        this.editingEmployee.language = NewLanguage(LanguageFactory.DEFAULT_LANGUAGE.toJS());
    }

    doRegister() {
        var registration = new Registration();
        var localCompany:LocalCompany = NewCompany(this.editingCompany);
        var company = LocalCompanyFactory.fromLocalCompany(localCompany);
        this.editingEmployee.locale = this.editingEmployee.language.locale;
        var localEmployee:LocalEmployee = NewEmployee(this.editingEmployee);
        var employee = LocalEmployeeFactory.fromLocalEmployee(localEmployee);
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