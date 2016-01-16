/**
 * Created by cghislai on 06/08/15.
 */
import {Component} from 'angular2/core';
import {NgIf, FORM_DIRECTIVES} from 'angular2/common';
import {Router} from 'angular2/router';


import {Pos, PosSearch} from '../../../client/domain/pos';
import {LocalPos} from '../../../client/localDomain/pos';
import {Language} from '../../../client/utils/lang';

import {PosService} from '../../../services/pos';
import {ErrorService} from '../../../services/error';
import {AuthService} from '../../../services/auth';
import {PaginationFactory, PageChangeEvent, ApplyPageChangeEvent} from '../../../client/utils/pagination';
import {SearchResult, SearchRequest} from '../../../client/utils/search';

import {Paginator} from '../../../components/utils/paginator/paginator';

import {PosList, PosColumn} from '../../../components/pos/list/posList';

import * as Immutable from 'immutable';

@Component({
    selector: 'pos-list-view',
    templateUrl: './routes/pos/list/listView.html',
    styleUrls: ['./routes/pos/list/listView.css'],
    directives: [NgIf, Paginator, FORM_DIRECTIVES, PosList]
})

export class PosListView {
    posService:PosService;
    errorService:ErrorService;
    router:Router;

    searchRequest:SearchRequest<LocalPos>;
    searchResult:SearchResult<LocalPos>;
    posPerPage:number = 25;
    columns: Immutable.List<PosColumn>;

    appLanguage:Language;
    loading:boolean;

    constructor(posService:PosService, appService:ErrorService,
                authService:AuthService, router:Router) {
        this.posService = posService;
        this.errorService = appService;
        this.router = router;

        this.searchRequest = new SearchRequest<LocalPos>();
        var posSearch = new PosSearch();
        posSearch.companyRef = authService.getEmployeeCompanyRef();
        var pagination = PaginationFactory.Pagination({firstIndex: 0, pageSize: this.posPerPage});
        this.searchRequest.pagination = pagination;
        this.searchRequest.search = posSearch;
        this.searchResult = new SearchResult<LocalPos>();

        this.appLanguage= authService.getEmployeeLanguage();
        this.columns = Immutable.List.of(
            PosColumn.NAME,
            PosColumn.DESCRIPTION
            //PosColumn.ACTION_REMOVE // FIXME: implement in backend
        );
        this.searchPosList();
    }

    searchPosList() {
        this.posService
            .search(this.searchRequest)
            .then((result:SearchResult<LocalPos>) => {
                this.searchResult = result;
            }).catch((error)=> {
                this.errorService.handleRequestError(error);
            });
    }


    onPageChanged(pageChange:PageChangeEvent) {
        this.searchRequest.pagination = ApplyPageChangeEvent(this.searchRequest.pagination, pageChange);
        this.searchPosList();
    }


    onColumnAction(event) {
        var pos:LocalPos = event.pos;
        var column:PosColumn= event.column;
        if (column === PosColumn.ACTION_REMOVE) {
            this.doRemovePos(pos);
        }
    }

    doEditPos(pos:LocalPos) {
        var id = pos.id;
        this.router.navigate(['/Pos/Edit', {id: id}]);
    }

    doRemovePos(pos:LocalPos) {
        var thisView = this;
        this.posService
            .remove(pos.id)
            .then(function (result) {
                thisView.searchPosList();
            }).catch((error)=> {
                this.errorService.handleRequestError(error);
            });
    }
}
