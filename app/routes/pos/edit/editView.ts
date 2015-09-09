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

import {LangSelect} from 'components/lang/langSelect/langSelect';
import {LocalizedDirective} from 'components/utils/localizedInput';

@Component({
    selector: 'editPos'
})
@View({
    templateUrl: './routes/pos/edit/editView.html',
    styleUrls: ['./routes/pos/edit/editView.css'],
    directives: [NgFor, NgIf, FORM_DIRECTIVES, RouterLink, LocalizedDirective, LangSelect]
})
export class EditPosView {
    posService:PosService;
    errorService:ErrorService;
    authService:AuthService;
    router:Router;

    appLocale:string;
    editLanguage:Language;
    editingPos:Pos;


    constructor(posService:PosService, authService:AuthService, appService:ErrorService,
                routeParams:RouteParams, router:Router) {

        this.router = router;
        this.posService = posService;
        this.authService = authService;
        this.errorService = appService;

        var language = authService.getEmployeeLanguage();
        this.editLanguage = language;
        this.appLocale = language.locale;
        this.findPos(routeParams);
    }

    findPos(routeParams:RouteParams) {
        if (routeParams == null || routeParams.params == null) {
            this.getNewPos();
            return;
        }
        var itemIdParam = routeParams.get('id');
        var posId = parseInt(itemIdParam);
        if (isNaN(posId)) {
            if (itemIdParam == 'new') {
                this.getNewPos();
                return;
            }
            this.getNewPos();
            return;
        }
        this.getPos(posId);
    }

    getNewPos() {
        this.editingPos = new Pos();
        this.editingPos.description = new LocaleTexts();
    }

    getPos(id:number) {
        this.posService.get(id)
            .then((pos)=> {
                this.editingPos = pos;
            });
    }

    doSaveEdit() {
        var company = this.authService.getEmployeeCompany();
        var companyRef = new CompanyRef(company.id);
        this.posService.save(this.editingPos)
            .then((posRef)=> {
                this.router.navigate('/pos/list');
            }).catch((error)=> {
                this.errorService.handleRequestError(error);
            });

    }

}
