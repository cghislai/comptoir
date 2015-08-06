/**
 * Created by cghislai on 05/08/15.
 */

import {Component, View, NgFor, NgIf, formDirectives} from 'angular2/angular2';

import {Company} from 'client/domain/company';
import {Locale} from 'services/utils';
import {ApplicationService} from 'services/application';
import {CompanyService} from 'services/company';

@Component({
    selector: 'appSettings'
})
@View({
    templateUrl: './components/settings/application/appSettings.html',
    styleUrls: ['./components/settings/application/appSettings.css'],
    directives: [NgFor, NgIf,formDirectives]
})
export class ApplicationSettingsView {
    applicationService: ApplicationService;
    companyService: CompanyService;

    companyValue: Company;
    localeList: Locale[];
    localeValue: Locale;

    constructor(applicationService: ApplicationService, companyService: CompanyService) {
        this.applicationService = applicationService;
        this.companyService = companyService;

        this.searchCompany();
        this.localeList = Locale.ALL_LOCALES;
        this.localeValue = applicationService.locale;
    }

    searchCompany() {
        var thisView = this;
        var companyRef = this.applicationService.companyRef;
        this.companyService
            .getCompany(companyRef.id)
            .then(function(result: Company) {
                thisView.companyValue = result;
            });
    }

    onLocaleSelected(event) {
        var localeValue = event.target.value;
        this.localeValue = Locale.formIsoCode(localeValue);
    }
    doSave(form) {
        this.applicationService.locale = this.localeValue;
    }
}