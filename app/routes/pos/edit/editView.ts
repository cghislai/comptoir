/**
 * Created by cghislai on 05/08/15.
 */
import {Component, View, NgIf} from 'angular2/angular2';
import {RouteParams, Router, RouterLink} from 'angular2/router';

import {Pos} from '../../../client/domain/pos';

import {AuthService} from '../../../services/auth';
import {PosService} from '../../../services/pos';
import {ErrorService} from '../../../services/error';

import {LocaleTexts} from '../../../client/utils/lang';
import {PossEditComponent} from '../../../components/pos/edit/editPos';

@Component({
    selector: 'editPos'
})
@View({
    templateUrl: './routes/pos/edit/editView.html',
    styleUrls: ['./routes/pos/edit/editView.css'],
    directives: [NgIf, RouterLink, PossEditComponent]
})
export class EditPosView {
    posService:PosService;
    errorService:ErrorService;
    authService:AuthService;
    router:Router;

    pos:Pos;


    constructor(posService:PosService, authService:AuthService, appService:ErrorService,
                routeParams:RouteParams, router:Router) {

        this.router = router;
        this.posService = posService;
        this.authService = authService;
        this.errorService = appService;

        this.findPos(routeParams);
    }

    findPos(routeParams:RouteParams) {
        if (routeParams === null || routeParams.params === null) {
            this.getNewPos();
            return;
        }
        var itemIdParam = routeParams.get('id');
        var posId = parseInt(itemIdParam);
        if (isNaN(posId)) {
            if (itemIdParam === 'new') {
                this.getNewPos();
                return;
            }
            this.getNewPos();
            return;
        }
        this.getPos(posId);
    }

    getNewPos() {
        this.pos = new Pos();
        this.pos.companyRef = this.authService.getEmployeeCompanyRef();
        this.pos.description = new LocaleTexts();
    }

    getPos(id:number) {
        this.posService.get(id)
            .then((pos)=> {
                this.pos = pos;
            });
    }

    onSaved(pos) {
        this.posService.save(pos)
            .then(()=> {
                this.router.navigate(['/Pos/List']);
            }).catch((error)=> {
                this.errorService.handleRequestError(error);
            });
    }

    doCancelEdit() {
        this.router.navigate(['/Pos/List']);
    }

}
