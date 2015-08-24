/**
 * Created by cghislai on 07/08/15.
 */

import {Component, View, NgFor, formDirectives} from 'angular2/angular2';
import {Router} from 'angular2/router';

import {Company} from 'client/domain/company';
import {Employee} from 'client/domain/employee';
import {Registration} from 'client/domain/auth';
import {LocaleTexts, Language} from 'client/utils/lang';

import {AuthService} from 'services/auth';
import {ApplicationService} from 'services/application';


@Component({
    selector: "registerView"
})
@View({
    templateUrl: './components/auth/register/register.html',
    styleUrls: ['./components/auth/register/register.css'],
    directives: [formDirectives, NgFor]
})
export class RegisterView {
    authService:AuthService;
    appService:ApplicationService;
    router:Router;

    company:Company;
    employee:Employee;
    password:string;

    appLocale:string;
    editLocale:string;
    allLanguages: Language[];

    constructor(authService:AuthService, appService:ApplicationService, router:Router) {
        this.authService = authService;
        this.appService = appService;
        this.router = router;

        this.company = new Company();
        this.company.name = new LocaleTexts();
        this.company.description = new LocaleTexts();
        this.employee = new Employee();

        this.appLocale = appService.language.locale;
        this.editLocale = this.appLocale;
        this.allLanguages = Language.ALL_LANGUAGES;
    }

    onSubmit() {
        var thisView = this;
        var registration = new Registration();
        registration.company = this.company;
        registration.employee = this.employee;
        registration.employeePassword = this.password;

        this.authService.register(registration)
            .then((employee)=> {
                thisView.router.navigate('/sales/sale/new');
            }).catch((error)=> {
                this.appService.showFatalError(error);
            });
    }

    onLanguageSelected(lang: string) {
        this.editLocale = lang;
    }
}