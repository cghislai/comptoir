/**
 * Created by cghislai on 06/08/15.
 */
import {Component, View, NgFor, NgIf, FORM_DIRECTIVES} from 'angular2/angular2';
import {Router} from 'angular2/router';


import {CompanyRef} from 'client/domain/company';
import {Pos, PosRef, PosSearch} from 'client/domain/pos';
import {LocaleTexts, Language} from 'client/utils/lang';

import {PosService} from 'services/pos';
import {ErrorService} from 'services/error';
import {AuthService} from 'services/auth';
import {Pagination} from 'client/utils/pagination';
import {SearchResult, SearchRequest} from 'client/utils/search';

import {Paginator} from 'components/utils/paginator/paginator';
import {AutoFocusDirective} from 'directives/autoFocus'
import {FocusableDirective} from 'directives/focusable'

@Component({
    selector: "possList"
})

@View({
    templateUrl: './routes/pos/list/listView.html',
    styleUrls: ['./routes/pos/list/listView.css'],
    directives: [NgFor, NgIf, Paginator, FORM_DIRECTIVES]
})

export class PosListView {
    posService:PosService;
    errorService: ErrorService;
    router:Router;

    searchRequest: SearchRequest<Pos>;
    searchResult:SearchResult<Pos>;
    posPerPage:number = 25;

    locale:string;
    loading:boolean;

    constructor(posService:PosService, appService:ErrorService,
                authService:AuthService, router:Router) {
        this.posService = posService;
        this.errorService = appService;
        this.router = router;

        this.searchRequest = new SearchRequest<Pos>();
        var posSearch = new PosSearch();
         posSearch.companyRef = new CompanyRef(authService.auth.employee.company.id);
        var pagination = new Pagination(0, this.posPerPage);
        this.searchRequest.pagination = pagination;
        this.searchRequest.search = posSearch;

        this.locale = authService.getEmployeeLanguage().locale;
        this.searchPosList();
    }

    searchPosList() {
        this.posService
            .search(this.searchRequest)
            .then(function (result:SearchResult<Pos>) {
                this.searchResult = result;
            }).catch((error)=> {
                this.errorService.handleRequestError(error);
            });
    }


    onPageChanged(pagination:Pagination) {
        this.searchRequest.pagination = pagination;
        this.searchPosList();
    }

    doEditPos(pos:Pos) {
        var id = pos.id;
        var url = '/pos/edit/' + id;
        this.router.navigate(url);
    }

    doRemovePos(pos:Pos, event) {
        var thisView = this;
        this.posService
            .remove(pos)
            .then(function (result) {
                thisView.searchPosList();
            }).catch((error)=> {
                this.errorService.handleRequestError(error);
            });
        event.stopPropagation();
        event.preventDefault();
    }


}