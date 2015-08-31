/**
 * Created by cghislai on 31/08/15.
 */

import {Component, View, NgIf, NgFor, EventEmitter} from 'angular2/angular2';

import {Pos, PosRef, PosSearch} from 'client/domain/pos';
import {SearchResult} from 'client/utils/search';
import {Language} from 'client/utils/lang';

import {PosService} from 'services/pos';
import {AuthService} from 'services/auth';
import {ErrorService} from 'services/error';

@Component({
    selector: 'posSelect',
    events: ['posChanged']
})
@View({
    templateUrl: './components/pos/posSelect/posSelect.html',
    directives: [NgFor, NgIf]
})
export class PosSelect {
    posService:PosService;
    authService: AuthService;
    errorService: ErrorService;

    allPosList:Pos[];
    pos:Pos;
    posId:number;
    language: Language;

    posChanged = new EventEmitter();

    constructor(posService: PosService, authService: AuthService, errorService: ErrorService) {
        this.posService = posService;
        this.authService = authService;
        this.errorService = errorService;

        this.language = authService.getEmployeeLanguage();
        this.searchPos();
    }
    searchPos() {
        var lastUsedPos = this.posService.lastUsedPos;
        if (lastUsedPos != null) {
            this.pos = lastUsedPos;
            this.posId = lastUsedPos.id;
            return;
        }
        var posSearch = new PosSearch();
        this.posService.searchPos(posSearch, null)
            .then((result:SearchResult<Pos>)=> {
                this.allPosList = result.list;
                if (result.list.length > 0 && this.pos == null) {
                    var pos = result.list[0];
                    this.setPos(pos);
                }
            }).catch((error)=> {
                this.errorService.handleRequestError(error);
            });
    }


    onPosChanged(event) {
        this.pos = null;
        this.posId = event.target.value;
        for (var posItem of this.allPosList) {
            if (posItem.id == this.posId) {
                this.setPos(posItem);
                return;
            }
        }
    }

    setPos(pos: Pos) {
        this.pos = pos;
        this.posId = pos.id;
        this.posService.lastUsedPos = this.pos;
        this.posChanged.next(pos);
    }

}