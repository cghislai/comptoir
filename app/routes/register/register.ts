/**
 * Created by cghislai on 07/08/15.
 */
import {Component, View, FORM_DIRECTIVES, NgFor} from 'angular2/angular2';
import {Router, RouterLink} from 'angular2/router';

import {AppHeader} from 'components/app/header/appHeader';
import {FormMessage} from 'components/utils/formMessage/formMessage';
import {LangSelect} from 'components/lang/langSelect/langSelect';
import {RequiredValidator, PasswordValidator} from 'components/utils/validators';
import {LocalizedDirective} from 'components/utils/localizedInput';

import {LocalCompany, LocalCompanyFactory} from 'client/localDomain/company';
import {LocalEmployee, LocalEmployeeFactory} from 'client/localDomain/employee';
import {Registration} from 'client/domain/auth';
import {LocaleTexts, Language} from 'client/utils/lang';

import {AuthService} from 'services/auth';
import {ErrorService} from 'services/error';


@Component({
    selector: "registerView"
})
@View({
    templateUrl: './routes/register/register.html',
    styleUrls: ['./routes/register/register.css'],
    directives: [FORM_DIRECTIVES, NgFor,  RouterLink, AppHeader, FormMessage,
        LangSelect, LocalizedDirective, RequiredValidator, PasswordValidator]
})
export class RegisterView {
    authService:AuthService;
    errorService: ErrorService;
    router:Router;

    editingCompany: LocalCompany;
    editingEmployee: LocalEmployee;
    password: string;

    appLocale:string;
    editLanguage:Language;
    allLanguages: Language[];

    constructor(authService:AuthService, errorService:ErrorService,
                router:Router) {
        this.authService = authService;
        this.errorService = errorService;
        this.router = router;

        this.appLocale = Language.DEFAULT_LANGUAGE.locale;
        this.editLanguage = Language.DEFAULT_LANGUAGE;
        this.allLanguages = Language.ALL_LANGUAGES;

        this.editingCompany = new LocalCompany();
        this.editingCompany.description = new LocaleTexts();
        this.editingCompany.name = new LocaleTexts();
        this.editingEmployee = new LocalEmployee();
    }

    getLanguage(locale: string) {
        return Language.fromLocale(locale);
    }

    doRegister() {
        var registration = new Registration();
        var company = LocalCompanyFactory.fromLocalCompany(this.editingCompany);
        var employee = LocalEmployeeFactory.fromLocalEmployee(this.editingEmployee);
        registration.company =company;
        registration.employee = employee;

        registration.employeePassword = this.password;

        this.authService.register(registration)
            .then((employee)=> {
                this.router.navigate('/sales/sale/active');
            }).catch((error)=> {
                this.errorService.handleRequestError(error);
            });

    }


}