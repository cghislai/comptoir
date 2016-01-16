/**
 * Created by cghislai on 31/08/15.
 */

import {Component,EventEmitter} from 'angular2/core';
import {NgIf, NgFor} from 'angular2/common';

import {Pos, PosSearch} from '../../../client/domain/pos';
import {LocalPos} from '../../../client/localDomain/pos';
import {SearchResult, SearchRequest} from '../../../client/utils/search';
import {Language} from '../../../client/utils/lang';

import {PosService} from '../../../services/pos';
import {AuthService} from '../../../services/auth';
import {ErrorService} from '../../../services/error';
import * as Immutable from 'immutable';

@Component({
    selector: 'pos-select',
    outputs: ['posChanged'],
    inputs: ['editable'],
    templateUrl: './components/pos/posSelect/posSelect.html',
    directives: [NgFor, NgIf]
})
export class PosSelect {
    posService:PosService;
    authService:AuthService;
    errorService:ErrorService;

    searchRequest:SearchRequest<LocalPos>;
    posList:Immutable.List<LocalPos>;
    pos:LocalPos;
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
        this.posList = Immutable.List([]);
        this.searchPos();
    }

    searchPos() {
        this.posService.search(this.searchRequest)
            .then((result:SearchResult<LocalPos>)=> {
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
        var posId:number = parseInt(event.target.value);
        var pos = this.posList.toSeq()
            .filter((pos)=> {
                return pos.id === posId;
            })
            .first();
        this.setPos(pos);
    }

    setPos(pos:LocalPos) {
        this.pos = pos;
        this.posService.lastUsedPos = this.pos;
        this.posChanged.next(pos);
    }

}
