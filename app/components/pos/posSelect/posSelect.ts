/**
 * Created by cghislai on 31/08/15.
 */

import {Component, View, NgIf, NgFor, EventEmitter, ChangeDetectionStrategy} from 'angular2/angular2';

import {Pos, PosRef, PosSearch} from '../../../client/domain/pos';
import {SearchResult, SearchRequest} from '../../../client/utils/search';
import {Language, LanguageFactory} from '../../../client/utils/lang';

import {PosService} from '../../../services/pos';
import {AuthService} from '../../../services/auth';
import {ErrorService} from '../../../services/error';
import {List} from 'immutable';

@Component({
    selector: 'posSelect',
    outputs: ['posChanged'],
    inputs: ['editable']
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
    posList:List<Pos>;
    pos:Pos;
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
        this.posList = List([]);
        this.searchPos();
    }

    searchPos() {
        this.posService.search(this.searchRequest)
            .then((result:SearchResult<Pos>)=> {
                this.posList = result.list;
                var lastUsedPos = this.posService.lastUsedPos;
                if (lastUsedPos != null) {
                    this.setPos(lastUsedPos);
                } else if (result.list.size > 0) {
                    var pos = result.list.first();
                    this.setPos(pos);
                }
            }).catch((error)=> {
                this.errorService.handleRequestError(error);
            });
    }


    onPosChanged(event) {
        var posId:number = event.target.value;
        var pos = this.posList.valueSeq()
            .filter((pos)=> {
                return pos.id == posId;
            })
            .first();
        this.setPos(pos);
    }

    setPos(pos:Pos) {
        this.pos = pos;
        this.posService.lastUsedPos = this.pos;
        this.posChanged.next(pos);
    }

}