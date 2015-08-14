/**
 * Created by cghislai on 05/08/15.
 */
import {Component, View, NgFor, NgIf, formDirectives} from 'angular2/angular2';
import {RouteParams, Router, RouterLink} from 'angular2/router';

import {Pos, PosRef} from 'client/domain/pos';
import {Customer, CustomerRef} from 'client/domain/customer';
import {LocaleText} from 'client/domain/lang';
import {Language, LocaleTexts} from 'client/utils/lang';
import {PosService} from 'services/pos';
import {ApplicationService} from 'services/application';
import {AuthService} from 'services/auth';


class PosFormModel {
    language:string;
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
        this.language = lang.locale;
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
    templateUrl: './components/pos/edit/editView.html',
    styleUrls: ['./components/pos/edit/editView.css'],
    directives: [NgFor, NgIf, formDirectives, RouterLink]
})
export class EditPosView {
    posId:number;
    posService:PosService;
    applicationService:ApplicationService;
    authService:AuthService;
    router:Router;

    language:Language;
    allLanguages:Language[] = Language.ALL_LANGUAGES;
    lastUsedLang:Language;
    posModel:PosFormModel;

    constructor(posService:PosService, authService:AuthService, appService:ApplicationService,
                routeParams:RouteParams, router:Router) {
        var itemIdParam = routeParams.get('id');
        this.posId = parseInt(itemIdParam);
        if (isNaN(this.posId)) {
            this.posId = null;
        }
        this.router = router;
        this.posService = posService;
        this.authService = authService;
        this.applicationService = appService;
        this.language = appService.language;
        this.lastUsedLang = appService.language;
        this.buildFormModel();
    }

    buildFormModel() {
        if (this.posId == null) {
            this.posModel = new PosFormModel();
            this.posModel.language = this.language.locale;
            return;
        }
        var thisView = this;
        this.posService.getPos(this.posId)
            .then(function (pos:Pos) {
                thisView.posModel = new PosFormModel(pos, thisView.lastUsedLang);
            });
    }

    onLanguageSelected(lang:Language) {
        this.lastUsedLang = lang;
        this.posModel.language = lang.locale;
    }

    doSaveEdit() {
        var pos = this.posModel.pos;
        pos.companyRef = this.authService.loggedEmployee.companyRef;
        pos.name = this.posModel.name;
        pos.description = this.posModel.description;
        this.posService.savePos(pos)
            .then((posRef)=> {
                this.router.navigate('/pos/list');
            });

    }

}
