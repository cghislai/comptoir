/**
 * Created by cghislai on 06/08/15.
 */
import {Component, View, NgFor, NgIf, formDirectives} from 'angular2/angular2';
import {Router} from 'angular2/router';


import {Pos, PosRef, PosSearch} from 'client/domain/pos';
import {SearchResult} from 'client/utils/search';
import {LocaleTexts, Language} from 'client/utils/lang';

import {PosService} from 'services/pos';
import {ApplicationService} from 'services/application';
import {AuthService} from 'services/auth';
import {Pagination} from 'client/utils/pagination';

import {Paginator} from 'components/utils/paginator/paginator';
import {AutoFocusDirective} from 'directives/autoFocus'
import {FocusableDirective} from 'directives/focusable'

@Component({
    selector: "possList"
})

@View({
    templateUrl: './components/pos/list/listView.html',
    styleUrls: ['./components/pos/list/listView.css'],
    directives: [NgFor, NgIf, Paginator, formDirectives]
})

export class PosListView {
    posService:PosService;
    router:Router;

    posSearch:PosSearch;
    pagination:Pagination;
    posSearchResult:SearchResult<Pos>;
    posCount:number;
    posPerPage:number = 25;

    language:string;
    loading:boolean;

    constructor(posService:PosService, appService:ApplicationService,
                authService:AuthService, router:Router) {
        this.posService = posService;
        this.router = router;

        this.posSearch = new PosSearch();
        this.posSearch.companyRef = authService.loggedEmployee.companyRef;
        this.pagination = new Pagination(0, this.posPerPage);

        this.language = appService.language.locale;
        this.searchPosList();
    }

    searchPosList() {
        // TODO: cancel existing promises;
        if (this.loading) {
            console.log('Already loading');
            return;
        }
        this.loading = true;
        var thisView = this;
        this.posService
            .searchPos(this.posSearch, this.pagination)
            .then(function (result:SearchResult<Pos>) {
                thisView.posSearchResult = result;
                thisView.posCount = result.count;
                thisView.loading = false;
            }, function (error) {
                console.log("Failed to load pos list : " + error);
                thisView.loading = false;
            });
    }


    onPageChanged(pagination:Pagination) {
        this.pagination = pagination;
        this.searchPosList();
    }

    doEditPos(pos:Pos) {
        var id = pos.id;
        var url = '/pos/edit/' + id;
        this.router.navigate(url);
    }

    doRemovePos(pos:Pos) {
        var thisView = this;
        this.posService
            .removePos(pos)
            .then(function (result) {
                thisView.searchPosList();
            }, function (error) {
                console.log("Failed to remove pos : " + error);
            });
    }


}