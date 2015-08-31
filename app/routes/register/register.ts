/**
 * Created by cghislai on 07/08/15.
 */
import {Component, View, FormBuilder, FORM_DIRECTIVES, ControlGroup, Control, NgFor} from 'angular2/angular2';
import {Router, RouterLink} from 'angular2/router';

import {AppHeader} from 'components/app/header/appHeader';
import {AppContent} from 'components/app/content/appContent';
import {FormMessage} from 'components/utils/formMessage/formMessage';
import {LangSelect, LocalizedDirective} from 'components/utils/langSelect/langSelect';
import {requiredValidator, passwordValidator} from 'components/utils/validators';

import {Company} from 'client/domain/company';
import {Employee} from 'client/domain/employee';
import {Registration} from 'client/domain/auth';
import {LocaleTexts, Language} from 'client/utils/lang';

import {AuthService} from 'services/auth';
import {ApplicationService} from 'services/application';


@Component({
    selector: "registerView",
    viewBindings: [FormBuilder]
})
@View({
    templateUrl: './routes/register/register.html',
    styleUrls: ['./routes/register/register.css'],
    directives: [FORM_DIRECTIVES, NgFor,  RouterLink, AppHeader, AppContent, FormMessage, LangSelect, LocalizedDirective]
})
export class RegisterView {
    authService:AuthService;
    appService:ApplicationService;
    router:Router;

    registerForm: ControlGroup;
    companyDescriptions: LocaleTexts;

    appLocale:string;
    editLanguage:Language;
    allLanguages: Language[];

    constructor(authService:AuthService, appService:ApplicationService,
                router:Router, formBuilder: FormBuilder) {
        this.authService = authService;
        this.appService = appService;
        this.router = router;

        this.appLocale = appService.language.locale;
        this.editLanguage = appService.language;
        this.allLanguages = Language.ALL_LANGUAGES;

        this.buildForm(formBuilder);
    }

    buildForm(formBuilder: FormBuilder) {
        this.companyDescriptions = new LocaleTexts();
        this.registerForm = formBuilder.group({
            'companyName': [''],
            'companyDescription': [''],
            'employeeFirstName': [''],
            'employeeLastName': [''],
            'employeeLanguage': [this.appLocale],
            'login': [''],
            'password': ['', passwordValidator]
        });
    }

    doRegister() {
        var thisView = this;
        var registration = new Registration();
        var company = new Company();
        company.name = this.registerForm.value.companyName;
        company.description = this.companyDescriptions;
        registration.company = company;
        var employee = new Employee();
        employee.firstName = this.registerForm.value.employeeFirstName;
        employee.lastName = this.registerForm.value.employeeLastName;
        registration.employee = employee;
        registration.employeePassword = this.registerForm.value.employeePassword;

        this.authService.register(registration)
            .then((employee)=> {
                thisView.router.navigate('/sales/active');
            }).catch((error)=> {
                this.appService.handleRequestError(error);
            });

    }


}