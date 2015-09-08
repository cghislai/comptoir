/**
 * Created by cghislai on 05/08/15.
 */
import {Component, View, NgFor, NgIf, FORM_DIRECTIVES} from 'angular2/angular2';
import {RouteParams, Router, RouterLink} from 'angular2/router';

import {CompanyRef} from 'client/domain/company';
import {Pos, PosRef} from 'client/domain/pos';
import {LocaleText} from 'client/domain/lang';
import {Customer, CustomerRef} from 'client/domain/customer';
import {Language, LocaleTexts} from 'client/utils/lang';

import {AuthService} from 'services/auth';
import {PosService} from 'services/pos';
import {ErrorService} from 'services/error';

import {LangSelect, LocalizedDirective} from 'components/utils/langSelect/langSelect';


class PosFormModel {
    language:Language;
    name:string;
    description:LocaleTexts;
    defaultCustomer: Customer;
    pos:Pos;

    constructor();
    constructor(pos:Pos, lang:Language);
    constructor(pos?:Pos, lang?:Language) {
        if (pos == undefined) {
            this.pos = new Pos();
            this.description = new LocaleTexts();
            return;
        }
        this.language = lang;
        this.pos = pos;
        this.name = pos.name;
        this.description = pos.description;
        this.defaultCustomer = null;
    }
}


@Component({
    selector: 'editPos'
})
@View({
    templateUrl: './routes/pos/edit/editView.html',
    styleUrls: ['./routes/pos/edit/editView.css'],
    directives: [NgFor, NgIf, FORM_DIRECTIVES, RouterLink, LocalizedDirective, LangSelect]
})
export class EditPosView {
    posId:number;
    posService:PosService;
    errorService:ErrorService;
    authService:AuthService;
    router:Router;

    language:Language;
    posModel:PosFormModel;

    constructor(posService:PosService, authService:AuthService, appService:ErrorService,
                routeParams:RouteParams, router:Router) {
        var itemIdParam = routeParams.get('id');
        this.posId = parseInt(itemIdParam);
        if (isNaN(this.posId)) {
            this.posId = null;
        }
        this.router = router;
        this.posService = posService;
        this.authService = authService;
        this.errorService = appService;
        this.language = authService.getEmployeeLanguage();
        this.buildFormModel();
    }

    buildFormModel() {
        var lastEditLanguage = this.language;
        if (this.posId == null) {
            this.posModel = new PosFormModel();
            this.posModel.language = lastEditLanguage;
            return;
        }
        var thisView = this;
        this.posService.get(this.posId)
            .then(function (pos:Pos) {
                thisView.posModel = new PosFormModel(pos, lastEditLanguage);
            }).catch((error)=> {
                this.errorService.handleRequestError(error);
            });
    }

    doSaveEdit() {
        var pos = this.posModel.pos;
        pos.companyRef = new CompanyRef(this.authService.auth.employee.company.id);
        pos.name = this.posModel.name;
        pos.description = this.posModel.description;
        this.posService.save(pos)
            .then((posRef)=> {
                this.router.navigate('/pos/list');
            }).catch((error)=> {
                this.errorService.handleRequestError(error);
            });

    }

}
