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
import {LocaleTexts, Language, LanguageFactory, LocaleTextsFactory} from 'client/utils/lang';

import {AuthService} from 'services/auth';
import {ErrorService} from 'services/error';

import {List, Map} from 'immutable';

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

    appLanguage:Language;
    editLanguage:Language;
    allLanguages: List<Language>;

    constructor(authService:AuthService, errorService:ErrorService,
                router:Router) {
        this.authService = authService;
        this.errorService = errorService;
        this.router = router;

        this.appLanguage = LanguageFactory.DEFAULT_LANGUAGE;
        this.editLanguage = LanguageFactory.DEFAULT_LANGUAGE;
        this.allLanguages = LanguageFactory.ALL_LANGUAGES;

        this.editingCompany = <LocalCompany>Map({});
        this.editingCompany.description = LocaleTextsFactory.toLocaleTexts({});
        this.editingCompany.name = LocaleTextsFactory.toLocaleTexts({});
        this.editingEmployee = <LocalEmployee>Map({});
    }

    getLanguage(locale: string) {
        return LanguageFactory.fromLocale(locale);
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