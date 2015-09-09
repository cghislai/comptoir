/**
 * Created by cghislai on 31/08/15.
 */

import {Component, View, NgIf, NgFor, EventEmitter} from 'angular2/angular2';

import {Pos, PosRef, PosSearch} from 'client/domain/pos';
import {SearchResult, SearchRequest} from 'client/utils/search';
import {Language} from 'client/utils/lang';

import {PosService} from 'services/pos';
import {AuthService} from 'services/auth';
import {ErrorService} from 'services/error';

@Component({
    selector: 'posSelect',
    events: ['posChanged'],
    properties: ['editable']
})
@View({
    templateUrl: './components/pos/posSelect/posSelect.html',
    directives: [NgFor, NgIf]
})
export class PosSelect {
    posService:PosService;
    authService:AuthService;
    errorService:ErrorService;

    searchRequest:SearchRequest<Pos>;
    searchResult:SearchResult<Pos>;
    pos:Pos;
    posId:number;
    language:Language;

    editable:boolean;
    posChanged = new EventEmitter();

    constructor(posService:PosService, authService:AuthService, errorService:ErrorService) {
        this.posService = posService;
        this.authService = authService;
        this.errorService = errorService;

        this.language = authService.getEmployeeLanguage();

        this.searchRequest = new SearchRequest<Pos>();
        var posSearch = new PosSearch();
        posSearch.companyRef = authService.getEmployeeCompanyRef();
        this.searchRequest.search = posSearch;

        this.searchPos();
    }

    searchPos() {
        this.posService.search(this.searchRequest)
            .then((result:SearchResult<Pos>)=> {
                this.searchResult = result;
                var lastUsedPos = this.posService.lastUsedPos;
                if (lastUsedPos != null) {
                    this.setPos(lastUsedPos);
                } else if (result.list.length > 0) {
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
        for (var posItem of this.searchResult.list) {
            if (posItem.id == this.posId) {
                this.setPos(posItem);
                return;
            }
        }
    }

    setPos(pos:Pos) {
        this.pos = pos;
        this.posId = pos.id;
        this.posService.lastUsedPos = this.pos;
        this.posChanged.next(pos);
    }

}