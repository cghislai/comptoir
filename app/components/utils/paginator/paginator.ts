/**
 * Created by cghislai on 02/08/15.
 */


import {Component, View, Attribute, EventEmitter, NgFor} from 'angular2/angular2';
import {Pagination} from 'services/utils'


@Component({
    selector: 'paginator',
    events: ['pagechange'],
    properties: ['totalCountParam: total-count', 'pageSizeParam: page-size'],
    host: {
        '(show)': 'buildPagesLinksArray()'
    }
})
@View({
    templateUrl: './components/utils/paginator/paginator.html',
    styleUrls: ['./components/utils/paginator/paginator.css'],
    directives: [NgFor]
})

export class Paginator {
    pageCount: number;
    pageSize: number;
    total: number;
    showPrevNextLink: boolean;
    showFirstLastLink: boolean;
    pages: number[];
    activePage: number;
    pagechange: EventEmitter;
    maxPageLinks: number = 10;

    constructor(@Attribute('show-prev-next') showPrevNext,
                @Attribute('show-first-last') showFirstLast) {
        this.showFirstLastLink = showFirstLast;
        this.showPrevNextLink = showPrevNext;
        this.activePage = 0;
        this.pagechange = new EventEmitter();
    }

    set totalCountParam(total: number) {
        this.total = total;
        this.buildPagesLinksArray();
    }
    set pageSizeParam(pageSize: number) {
        this.pageSize = pageSize;
        this.buildPagesLinksArray();
    }
    buildPagesLinksArray() {
        this.pages = [];
        this.pageCount = Math.ceil(this.total / this.pageSize);

        var pageLinkShown = 0;
        var firstIndex = this.activePage - this.maxPageLinks / 2;
        firstIndex = Math.max(firstIndex, 0);
        var lastIndex = firstIndex + this.maxPageLinks;
        lastIndex = Math.min(lastIndex, this.pageCount - 1);
        for (var pageIndex = firstIndex; pageIndex <= lastIndex; pageIndex++) {
            this.pages.push(pageIndex);
        }
    }

    goToFirst() {
        this.goToPage(0);
    }
    goToLast() {
        this.goToPage(this.pageCount - 1);
    }
    goToPrev() {
        if (this.activePage == 0) {
            return;
        }
        this.goToPage(this.activePage - 1);
    }
    goToNext() {
        if (this.activePage >= this.pageCount - 1) {
            return;
        }
        this.goToPage(this.activePage + 1);
    }
    hasPrev() {
        return this.activePage > 0;
    }
    hasNext() {
        return this.activePage < this.pageCount - 1;
    }

    goToPage(pageIndex: number) {
        this.activePage = pageIndex;
        var pagination = new Pagination();
        pagination.pageIndex = pageIndex;
        var firstIndex = pageIndex * this.pageSize;
        var pageSize = Math.min(this.pageSize, this.total - firstIndex);
        pagination.firstIndex = firstIndex;
        pagination.pageSize = pageSize;
        this.buildPagesLinksArray();

        this.pagechange.next(pagination);
    }

}