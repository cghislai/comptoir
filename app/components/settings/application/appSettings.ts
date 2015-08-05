/**
 * Created by cghislai on 05/08/15.
 */

import {Component, View, NgFor, formDirectives} from 'angular2/angular2';

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
    directives: [NgFor, formDirectives]
})
export class ApplicationSettingsView {
    applicationService: ApplicationService;
    companyService: CompanyService;

    companyList: Company[];
    companyValue: Company;
    localeList: Locale[];
    localeValue: Locale;

    constructor(applicationService: ApplicationService, companyService: CompanyService) {
        this.applicationService = applicationService;
        this.companyService = companyService;

        this.searchCompanies();
        this.companyValue = applicationService.company;
        this.localeList = Locale.ALL_LOCALES;
        this.localeValue = applicationService.locale;
    }

    searchCompanies() {
        var thisView = this;
        this.companyService
            .searchCompanies()
            .then(function(result: Company[]) {
                thisView.companyList = result;
            });
    }

    onCompanySelected(event) {
        var companyIdValue = event.target.value;
        if (companyIdValue == undefined) {
            this.companyValue = undefined;
            return;
        }
        var companyId = parseInt(companyIdValue);
        if (isNaN(companyId)) {
            this.companyValue = undefined;
            return;
        }
        var thisView = this;
        this.companyService.getCompany(companyId)
        .then(function(company: Company) {
                thisView.companyValue = company;
            })
    }
    onLocaleSelected(event) {
        var localeValue = event.target.value;
        this.localeValue = Locale.formIsoCode(localeValue);
    }
    doSave(form) {
        this.applicationService.company = this.companyValue;
        this.applicationService.locale = this.localeValue;
    }
}