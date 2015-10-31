/**
 * Created by cghislai on 06/08/15.
 */
import {Component, View, NgIf, FORM_DIRECTIVES} from 'angular2/angular2';
import {Router} from 'angular2/router';


import {CompanyRef} from '../../../client/domain/company';
import {Pos, PosRef, PosSearch} from '../../../client/domain/pos';
import {LocaleTexts, Language} from '../../../client/utils/lang';

import {PosService} from '../../../services/pos';
import {ErrorService} from '../../../services/error';
import {AuthService} from '../../../services/auth';
import {Pagination, PaginationFactory, PageChangeEvent, ApplyPageChangeEvent} from '../../../client/utils/pagination';
import {SearchResult, SearchRequest} from '../../../client/utils/search';

import {Paginator} from '../../../components/utils/paginator/paginator';
import {AutoFocusDirective} from '../../../components/utils/autoFocus'
import {FocusableDirective} from '../../../components/utils/focusable'

import {PosList, PosColumn} from '../../../components/pos/list/posList';

import {List} from 'immutable';

@Component({
    selector: "posListView"
})

@View({
    templateUrl: './routes/pos/list/listView.html',
    styleUrls: ['./routes/pos/list/listView.css'],
    directives: [NgIf, Paginator, FORM_DIRECTIVES, PosList]
})

export class PosListView {
    posService:PosService;
    errorService:ErrorService;
    router:Router;

    searchRequest:SearchRequest<Pos>;
    searchResult:SearchResult<Pos>;
    posPerPage:number = 25;
    columns: List<PosColumn>;

    appLanguage:Language;
    loading:boolean;

    constructor(posService:PosService, appService:ErrorService,
                authService:AuthService, router:Router) {
        this.posService = posService;
        this.errorService = appService;
        this.router = router;

        this.searchRequest = new SearchRequest<Pos>();
        var posSearch = new PosSearch();
        posSearch.companyRef = authService.getEmployeeCompanyRef();
        var pagination = PaginationFactory.Pagination({firstIndex: 0, pageSize: this.posPerPage});
        this.searchRequest.pagination = pagination;
        this.searchRequest.search = posSearch;
        this.searchResult = new SearchResult<Pos>();

        this.appLanguage= authService.getEmployeeLanguage();
        this.columns = List.of(
            PosColumn.NAME,
            PosColumn.DESCRIPTION,
            PosColumn.ACTION_REMOVE
        );
        this.searchPosList();
    }

    searchPosList() {
        this.posService
            .search(this.searchRequest)
            .then((result:SearchResult<Pos>) => {
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
        var pos:Pos = event.pos;
        var column:PosColumn= event.column;
        if (column == PosColumn.ACTION_REMOVE) {
            this.doRemovePos(pos);
        }
    }

    doEditPos(pos:Pos) {
        var id = pos.id;
        this.router.navigate(['/Pos/Edit', {id: id}]);
    }

    doRemovePos(pos:Pos) {
        var thisView = this;
        this.posService
            .remove(pos)
            .then(function (result) {
                thisView.searchPosList();
            }).catch((error)=> {
                this.errorService.handleRequestError(error);
            });
    }


}